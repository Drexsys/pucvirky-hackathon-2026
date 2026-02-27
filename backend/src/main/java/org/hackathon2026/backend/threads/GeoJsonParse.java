package org.hackathon2026.backend.threads;

import org.hackathon2026.backend.jsonTools.GeoJsonRead;

import java.io.File;

public class GeoJsonParse extends Thread {

    private final String geoJsonFilePath, propertyName;
    private final float longitude, latitude;

    private GeoJsonRead.InfoRecord info;

    public GeoJsonParse(
            String geoJsonFilePath,
            float longitude, float latitude,
            String propertyName
    ) {
        this.geoJsonFilePath = geoJsonFilePath;
        this.longitude = longitude;
        this.latitude = latitude;
        this.propertyName = propertyName;
    }

    @Override
    public void run() {
        File geoJsonFile = new File(geoJsonFilePath);
        GeoJsonRead geoJsonRead;
        try {
            geoJsonRead = new GeoJsonRead(geoJsonFile, propertyName);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        info = geoJsonRead.find(longitude, latitude);
    }

    public GeoJsonRead.InfoRecord getInfo() {
        return info;
    }

}
