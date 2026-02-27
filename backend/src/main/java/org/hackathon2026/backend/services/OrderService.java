package org.hackathon2026.backend.services;

import org.hackathon2026.backend.models.Order;
import org.hackathon2026.backend.repositories.OrderRepository;
import org.hackathon2026.backend.specifications.OrderSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Page<Order> findOrders(
            Pageable pageable,
            Integer minSubtotal, Integer maxSubtotal,
            Instant fromTs, Instant toTs,
            String otherJurisdictions
    ) {
        Specification<Order> spec = Specification.where(OrderSpecification.subtotalBetween(minSubtotal, maxSubtotal))
                .and(OrderSpecification.timestampBetween(fromTs, toTs))
                .and(OrderSpecification.jurisdictionsEqual(otherJurisdictions));

        return orderRepository.findAll(spec, pageable);
    }

    public void save(Order order) {
        orderRepository.save(order);
    }
    public Long count() {
        return orderRepository.count();
    }

}

