package org.hackathon2026.backend.repositories;

import org.hackathon2026.backend.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OrderRepository extends JpaRepository<Order, Long> {
}
