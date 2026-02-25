package org.hackathon2026.backend.controllers;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.hackathon2026.backend.dto.GetTaxRateDto;
import org.hackathon2026.backend.dto.OrderDto;
import org.hackathon2026.backend.external.ExternalApiService;
import org.hackathon2026.backend.models.Order;
import org.hackathon2026.backend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ExternalApiService externalApiService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void postOrder(@Valid @RequestBody OrderDto body) throws BadRequestException {
        GetTaxRateDto response = externalApiService.getTaxRate(body.getLatitude(), body.getLongitude());

        orderRepository.save(new Order(body.getLatitude(), body.getLongitude(),
                body.getSubtotal(), body.getTimestamp(), response.getBaseRates()));

    }

}
