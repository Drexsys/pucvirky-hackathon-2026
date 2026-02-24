package org.hackathon2026.backend.dto;

public class OrderDto {

    private int subtotal;
    private float latitude, longitude;
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
