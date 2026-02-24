package org.hackathon2026.backend.repositories;

import org.hackathon2026.backend.models.Order;
import org.springframework.data.repository.CrudRepository;

public interface OrderRepository extends CrudRepository<Order, Long> {
}
