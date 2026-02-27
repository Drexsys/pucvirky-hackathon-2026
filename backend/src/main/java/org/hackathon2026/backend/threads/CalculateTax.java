package org.hackathon2026.backend.threads;

import org.hackathon2026.backend.controllers.OrderController;
import org.hackathon2026.backend.dto.OrderDto;
import org.hackathon2026.backend.jsonTools.CountyJsonRead;
import org.hackathon2026.backend.jsonTools.GeoJsonRead;
import org.hackathon2026.backend.models.CountyInfo;
import org.hackathon2026.backend.services.OrderService;

import java.util.List;

public class CalculateTax extends Thread {

    private final List<OrderDto> ordersDto;
    private final int startFrom, endAt;
    private final GeoJsonRead geoJsonCounty, geoJsonCity;
    private OrderService orderService;

    public CalculateTax(
            List<OrderDto> ordersDto,
            int startFrom, int endAt,
            GeoJsonRead geoJsonCounty,
            GeoJsonRead geoJsonCity,
            OrderService orderService
    ) {
        this.ordersDto = ordersDto;
        this.startFrom = startFrom;
        this.endAt = endAt;
        this.geoJsonCounty = geoJsonCounty;
        this.geoJsonCity = geoJsonCity;
        this.orderService = orderService;
    }

    @Override
    public void run() {
        for (int i = startFrom; i < endAt; i++) {
            var countyCode = geoJsonCounty.find(ordersDto.get(i).getLongitude(), ordersDto.get(i).getLatitude());
            var cityName = geoJsonCity.find(ordersDto.get(i).getLongitude(), ordersDto.get(i).getLatitude());

            if (countyCode == null) continue;

            try {
                CountyInfo countyInfo = CountyJsonRead.getCountyInfo(
                        countyCode.name(),
                        OrderController.getCountyFilePath());

                orderService.save(new org.hackathon2026.backend.models.Order(
                        ordersDto.get(i).getLatitude(),
                        ordersDto.get(i).getLongitude(),
                        (int) ordersDto.get(i).getSubtotal(),
                        ordersDto.get(i).getTimestamp(),
                        countyInfo,
                        (cityName != null) ? cityName.name() : ""
                ));

                System.out.println(i);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

}
