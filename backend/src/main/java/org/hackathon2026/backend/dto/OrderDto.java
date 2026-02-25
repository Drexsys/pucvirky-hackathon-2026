package org.hackathon2026.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OrderDto {

    @NotNull(message = "Subtotal is required")
    @Positive(message = "Subtotal must be positive")
    private int subtotal;

    @NotNull(message = "Latitude is required")
    private float latitude;

    @NotNull(message = "Longitude is required")
    private float longitude;

    @NotBlank(message = "Timestamp is required")
    private String timestamp;

    public int getSubtotal() {
        return subtotal;
    }

    public float getLatitude() {
        return latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public String getTimestamp() {
        return timestamp;
    }

}
