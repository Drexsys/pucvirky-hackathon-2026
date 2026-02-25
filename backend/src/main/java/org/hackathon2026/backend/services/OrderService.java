package org.hackathon2026.backend.services;

import org.hackathon2026.backend.models.Order;
import org.hackathon2026.backend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Page<Order> findPaginatedOrder(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public void save(Order order) {
        orderRepository.save(order);
    }
}

