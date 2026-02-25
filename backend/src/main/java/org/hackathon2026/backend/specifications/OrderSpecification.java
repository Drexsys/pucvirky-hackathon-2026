package org.hackathon2026.backend.specifications;

import org.hackathon2026.backend.models.Order;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;

public class OrderSpecification {

    public static Specification<Order> subtotalBetween(Integer min, Integer max) {
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

    public static Specification<Order> jurisdictionsEqual(String otherJurisdictions) {
        return (root, query, cb) -> {
            if (otherJurisdictions == null) return cb.conjunction();
            return cb.equal(root.get("jurisdictions"), otherJurisdictions);
        };
    }
}
