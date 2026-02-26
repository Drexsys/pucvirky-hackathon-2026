package org.hackathon2026.backend.models;

import jakarta.persistence.*;
import org.hackathon2026.backend.dto.BaseRates;

import java.time.Instant;
import java.util.List;

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
            List<BaseRates> baseRates
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.subtotal = subtotal;

        var timeT = timestamp.split(" ");
        this.timestamp = Instant.parse(timeT[0] + "T" + timeT[1] + "Z");

        calculateTax(baseRates);
    }

    private void calculateTax(List<BaseRates> baseRates) {
        this.jurisdictions = "";

        for (int i = 0; i < baseRates.size(); i += 2) {
            this.compositeTaxRate += baseRates.get(i).getRate();

            switch (i) {
                case 0:
                    this.stateRate = baseRates.get(i).getRate();break;
                case 2:
                    this.countyRate = baseRates.get(i).getRate();break;
                case 4:
                    this.cityRate = baseRates.get(i).getRate();break;
                case 6:
                    this.specialRate = baseRates.get(i).getRate();break;
            }

            if (i < 8)
                this.jurisdictions = new StringBuilder().append(this.jurisdictions)
                        .append(baseRates.get(i).getJurName())
                        .append((i != 4) ? " " : "").toString();
        }

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
