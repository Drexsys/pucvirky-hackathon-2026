package org.hackathon2026.backend.dto;

import com.opencsv.bean.CsvBindByName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class OrderDto {

    @CsvBindByName(column = "subtotal")
    @NotNull(message = "Subtotal is required")
    @Positive(message = "Subtotal must be positive")
    private Float subtotal;

    @CsvBindByName(column = "latitude")
    @NotNull(message = "Latitude is required")
    private Float latitude;

    @CsvBindByName(column = "longitude")
    @NotNull(message = "Longitude is required")
    private Float longitude;

    @CsvBindByName(column = "timestamp")
    @NotBlank(message = "Timestamp is required")
    private String timestamp;

    public float getSubtotal() {
        return subtotal;
    }
    public Float getLatitude() {
        return latitude;
    }
    public Float getLongitude() {
        return longitude;
    }
    public String getTimestamp() {
        return timestamp;
    }

}
