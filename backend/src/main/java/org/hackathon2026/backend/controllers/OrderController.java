package org.hackathon2026.backend.controllers;

import jakarta.validation.Valid;
import org.hackathon2026.backend.dto.GetTaxRateDto;
import org.hackathon2026.backend.dto.OrderDto;
import org.hackathon2026.backend.external.ExternalApiService;
import org.hackathon2026.backend.jsonTools.GeoJsonRead;
import org.hackathon2026.backend.models.Order;
import org.hackathon2026.backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.time.Instant;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private ExternalApiService externalApiService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void postOrder(@Valid @RequestBody OrderDto body) throws Exception {
        File geoJsonFile = new File("cugir-008180-geojson.json");
        GeoJsonRead geoJsonRead = new GeoJsonRead(geoJsonFile, "county");
        var info = geoJsonRead.findCounty(body.getLongitude(), body.getLatitude());
        System.out.println((info != null) ? info.countyCode : "Not found");

        GetTaxRateDto response = externalApiService.getTaxRate(body.getLatitude(), body.getLongitude());

        orderService.save(new Order(body.getLatitude(), body.getLongitude(),
                body.getSubtotal(), body.getTimestamp(), response.getBaseRates()));
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
