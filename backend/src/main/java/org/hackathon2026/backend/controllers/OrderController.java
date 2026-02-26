package org.hackathon2026.backend.controllers;

import jakarta.validation.Valid;
import org.hackathon2026.backend.dto.OrderDto;
import org.hackathon2026.backend.jsonTools.CountyJsonRead;
import org.hackathon2026.backend.jsonTools.GeoJsonRead;
import org.hackathon2026.backend.models.CountyInfo;
import org.hackathon2026.backend.models.Order;
import org.hackathon2026.backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.time.Instant;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private static final String geoJsonFilePath = "jsons/cugir-008180-geojson.json";
    private static final String countyFilePath = "jsons/countyInfo.json";

    @PostMapping
    public ResponseEntity<String> postOrder(@Valid @RequestBody OrderDto body) throws Exception {
        File geoJsonFile = new File(geoJsonFilePath);
        GeoJsonRead geoJsonRead = new GeoJsonRead(geoJsonFile, "county");
        var info = geoJsonRead.findCounty(body.getLongitude(), body.getLatitude());

        if (info == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Location is outside of the covered area.");

        CountyInfo countyInfo = CountyJsonRead.getCountyInfo(info.countyCode, countyFilePath);

        orderService.save(new Order(body.getLatitude(), body.getLongitude(),
                body.getSubtotal(), body.getTimestamp(), countyInfo));

        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @GetMapping
    public Iterable<Order> getOrders(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,

            @RequestParam(required = false) Integer fromSubtotal,
            @RequestParam(required = false) Integer toSubtotal,

            @RequestParam(required = false) String fromTime,
            @RequestParam(required = false) String toTime,

            @RequestParam(required = false) String jurisdictions
    ) {
        Instant fromTimeI = null, toTimeI = null;

        if (fromTime != null) {
            var fTimeT = fromTime.split(" ");
            fromTimeI = Instant.parse(fTimeT[0] + "T" + fTimeT[1] + "Z");
        }

        if (toTime != null) {
            var tTimeT = toTime.split(" ");
            toTimeI = Instant.parse(tTimeT[0] + "T" + tTimeT[1] + "Z");
        }

        if (toTimeI != null && fromTimeI != null) {
            if (fromTimeI.isAfter(toTimeI)) {
                var ttt = fromTimeI;
                fromTimeI = toTimeI;
                toTimeI = ttt;
            }
        }

        return orderService.findOrders(
                PageRequest.of(page, pageSize),
                fromSubtotal, toSubtotal,
                fromTimeI, toTimeI,
                jurisdictions
        );
    }

}
