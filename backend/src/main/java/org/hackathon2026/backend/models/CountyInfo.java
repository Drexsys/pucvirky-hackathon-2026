package org.hackathon2026.backend.models;

public class CountyInfo {

    private String name;
    private float countyTaxRate, cityTaxRate, specialTaxRate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getCountyTaxRate() {
        return countyTaxRate;
    }

    public void setCountyTaxRate(float countyTaxRate) {
        this.countyTaxRate = countyTaxRate;
    }

    public float getCityTaxRate() {
        return cityTaxRate;
    }

    public void setCityTaxRate(float cityTaxRate) {
        this.cityTaxRate = cityTaxRate;
    }

    public float getSpecialTaxRate() {
        return specialTaxRate;
    }

    public void setSpecialTaxRate(float specialTaxRate) {
        this.specialTaxRate = specialTaxRate;
    }

}
