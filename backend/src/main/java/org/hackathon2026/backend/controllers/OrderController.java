package org.hackathon2026.backend.controllers;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.hackathon2026.backend.dto.GetTaxRateDto;
import org.hackathon2026.backend.dto.OrderDto;
import org.hackathon2026.backend.external.ExternalApiService;
import org.hackathon2026.backend.models.Order;
import org.hackathon2026.backend.repositories.OrderRepository;
import org.hackathon2026.backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private ExternalApiService externalApiService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void postOrder(@Valid @RequestBody OrderDto body) throws BadRequestException {
        GetTaxRateDto response = externalApiService.getTaxRate(body.getLatitude(), body.getLongitude());

        orderService.save(new Order(body.getLatitude(), body.getLongitude(),
                body.getSubtotal(), body.getTimestamp(), response.getBaseRates()));
    }

    @GetMapping
    public Iterable<Order> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return orderService.findPaginatedOrder(PageRequest.of(page, pageSize));
    }

}
