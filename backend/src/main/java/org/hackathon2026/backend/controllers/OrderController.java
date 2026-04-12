package org.hackathon2026.backend.controllers;

import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.validation.Valid;
import org.hackathon2026.backend.dto.OrderDto;
import org.hackathon2026.backend.jsonTools.CountyJsonRead;
import org.hackathon2026.backend.jsonTools.GeoJsonRead;
import org.hackathon2026.backend.models.CountyInfo;
import org.hackathon2026.backend.models.Order;
import org.hackathon2026.backend.services.OrderService;
import org.hackathon2026.backend.threads.CalculateTax;
import org.hackathon2026.backend.threads.GeoJsonParse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private static final String geoJsonFilePath = "jsons/cugir-008180-geojson.json";
    private static final String geoJsonCityPath = "jsons/cityInfo.json";
    private static final String countyFilePath = "jsons/countyInfo.json";

    private GeoJsonParse countyJsonParse = null;
    private GeoJsonRead geoJsonReadCity = null;

    @PostMapping
    public ResponseEntity<String> postOrder(@Valid @RequestBody OrderDto body) throws Exception {
        if (countyJsonParse == null) {
            countyJsonParse = new GeoJsonParse(
                    geoJsonFilePath, "county");
            countyJsonParse.start();
        }

        if (geoJsonReadCity == null) {
            geoJsonReadCity = new GeoJsonRead(new File(geoJsonCityPath), "NAME");
        }
        // TODO: exception for undefined county or city
        var cityName = geoJsonReadCity.find(body.getLongitude(), body.getLatitude());

        countyJsonParse.join();
        GeoJsonRead geoJsonRead = countyJsonParse.getGeoJsonRead();
        var infoC = geoJsonRead.find(body.getLongitude(), body.getLatitude());

        CountyInfo countyInfo = CountyJsonRead.getCountyInfo(infoC.name(), countyFilePath);

        orderService.save(new Order(body.getLatitude(), body.getLongitude(),
                (int) body.getSubtotal(), body.getTimestamp(), countyInfo, cityName.name()));

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

    @PostMapping("/import")
    public Long importOrders(@RequestParam("file") MultipartFile file) throws Exception {
        String[][] pathParts = {
                {geoJsonFilePath, "county"},
                {geoJsonCityPath, "NAME"}
        };

        GeoJsonParse[] threadsParse = new GeoJsonParse[2];
        for (byte i = 0; i < 2; i++) {
            GeoJsonParse thread = new GeoJsonParse(
                    pathParts[i][0], pathParts[i][1]);
            thread.start();
            threadsParse[i] = thread;
        }

        List<OrderDto> ordersInfo = new CsvToBeanBuilder<OrderDto>(
                new java.io.InputStreamReader(file.getInputStream(),
                        java.nio.charset.StandardCharsets.UTF_8))
                .withType(OrderDto.class)
                .withIgnoreLeadingWhiteSpace(true)
                .build()
                .parse();

        for (GeoJsonParse thread : threadsParse)
            thread.join();

        int threadsCount = Runtime.getRuntime().availableProcessors();
        int ordersPerThread = ordersInfo.size() / threadsCount;
        CalculateTax[] threadsTax = new CalculateTax[threadsCount];
        for (int i = 0; i < threadsCount; i++) {
            int start = i * ordersPerThread;
            int end = (i == threadsCount - 1) ? (ordersInfo.size() - 1) : (start + ordersPerThread);

            var calculateTax = new CalculateTax(
                    ordersInfo,
                    start, end,
                    threadsParse[0].getGeoJsonRead(),
                    threadsParse[1].getGeoJsonRead(),
                    orderService
            );
            calculateTax.start();

            threadsTax[i] = calculateTax;
        }

        for (CalculateTax thread : threadsTax)
            thread.join();

        return orderService.count();
    }

    public static String getCountyFilePath() {
        return countyFilePath;
    }

}
