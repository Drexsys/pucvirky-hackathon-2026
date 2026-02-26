package org.hackathon2026.backend.models;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private float latitude, longitude;
    private int subtotal;
    private Instant timestamp;

    private float compositeTaxRate;
    private float taxAmount;
    private float totalAmount;

    private float stateRate;
    private float countyRate;
    private float cityRate;
    private float specialRate;

    private String jurisdictions;

    public Order() {}

    public Order(
            float latitude, float longitude,
            int subtotal, String timestamp,
            CountyInfo countyInfo, String cityName
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.subtotal = subtotal;

        var timeT = timestamp.split(" ");
        this.timestamp = Instant.parse(timeT[0] + "T" + timeT[1] + "Z");

        this.stateRate = 0.04f;
        this.countyRate = countyInfo.getCountyTaxRate();
        this.cityRate = countyInfo.getCityTaxRate();
        this.specialRate = countyInfo.getSpecialTaxRate();

        this.jurisdictions = "NY " + countyInfo.getName() + " " + cityName;

        calculateTax();
    }

    private void calculateTax() {
        this.compositeTaxRate = this.stateRate + this.countyRate + this.cityRate + this.specialRate;
        this.taxAmount = this.subtotal * this.compositeTaxRate;
        this.totalAmount = this.subtotal + this.taxAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public float getLatitude() {
        return latitude;
    }
    public float getLongitude() {
        return longitude;
    }
    public Integer getSubtotal() {
        return subtotal;
    }
    public Instant getTimestamp() {
        return timestamp;
    }
    public float getCompositeTaxRate() {
        return compositeTaxRate;
    }
    public float getTaxAmount() {
        return taxAmount;
    }
    public float getTotalAmount() {
        return totalAmount;
    }
    public float getStateRate() {
        return stateRate;
    }
    public float getCountyRate() {
        return countyRate;
    }
    public float getCityRate() {
        return cityRate;
    }
    public float getSpecialRate() {
        return specialRate;
    }
    public String getJurisdictions() {
        return jurisdictions;
    }

}
