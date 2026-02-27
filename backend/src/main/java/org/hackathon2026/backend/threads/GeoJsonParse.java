package org.hackathon2026.backend.threads;

import org.hackathon2026.backend.jsonTools.GeoJsonRead;

import java.io.File;

public class GeoJsonParse extends Thread {

    private final String geoJsonFilePath, propertyName;

    private GeoJsonRead geoJsonRead;

    public GeoJsonParse(
            String geoJsonFilePath,
            String propertyName
    ) {
        this.geoJsonFilePath = geoJsonFilePath;
        this.propertyName = propertyName;
        this.geoJsonRead = null;
    }

    @Override
    public void run() {
        File geoJsonFile = new File(geoJsonFilePath);
        try {
            geoJsonRead = new GeoJsonRead(geoJsonFile, propertyName);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public GeoJsonRead getGeoJsonRead() {
        return geoJsonRead;
    }

}
