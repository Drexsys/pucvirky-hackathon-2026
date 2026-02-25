package org.hackathon2026.backend.specifications;

import org.hackathon2026.backend.models.Order;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;

public class OrderSpecification {

    public static Specification<Order> subtotalBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min == null) return cb.lessThanOrEqualTo(root.get("subtotal"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("subtotal"), min);
            return cb.between(root.get("subtotal"), min, max);
        };
    }

    public static Specification<Order> timestampBetween(Instant from, Instant to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return cb.conjunction();
            if (from == null) return cb.lessThanOrEqualTo(root.get("timestamp"), to);
            if (to == null) return cb.greaterThanOrEqualTo(root.get("timestamp"), from);
            return cb.between(root.get("timestamp"), from, to);
        };
    }

    public static Specification<Order> latitudeBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min == null) return cb.lessThanOrEqualTo(root.get("latitude"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("latitude"), min);
            return cb.between(root.get("latitude"), min, max);
        };
    }

    public static Specification<Order> longitudeBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min == null) return cb.lessThanOrEqualTo(root.get("longitude"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("longitude"), min);
            return cb.between(root.get("longitude"), min, max);
        };
    }
}
