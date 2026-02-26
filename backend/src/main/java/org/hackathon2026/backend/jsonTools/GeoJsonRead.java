package org.hackathon2026.backend.jsonTools;

import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.geojson.feature.FeatureJSON;
import org.locationtech.jts.geom.*;
import org.locationtech.jts.index.strtree.STRtree;
import org.geotools.api.feature.simple.SimpleFeature;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

public class GeoJsonRead {

    public static class CountyRecord {
        public final Geometry geometry;
        public final String countyCode;
        public final SimpleFeature feature;

        public CountyRecord(Geometry geometry, String countyCode, SimpleFeature feature) {
            this.geometry = geometry;
            this.countyCode = countyCode;
            this.feature = feature;
        }
    }

    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final STRtree index = new STRtree();
    private final List<CountyRecord> all = new ArrayList<>();

    public GeoJsonRead(File geoJsonFile, String countyNameProperty) throws Exception {
        FeatureJSON fjson = new FeatureJSON();
        try (FileInputStream fis = new FileInputStream(geoJsonFile)) {
            SimpleFeatureCollection fc = (SimpleFeatureCollection) fjson.readFeatureCollection(fis);

            try (SimpleFeatureIterator it = fc.features()) {
                while (it.hasNext()) {
                    SimpleFeature feature = it.next();

                    Object geomObj = feature.getDefaultGeometry();
                    if (!(geomObj instanceof Geometry)) continue;

                    Geometry geom = (Geometry) geomObj;

                    Object nameObj = feature.getAttribute(countyNameProperty);
                    String countyName = nameObj != null ? nameObj.toString() : "UNKNOWN";

                    CountyRecord rec = new CountyRecord(geom, countyName, feature);
                    all.add(rec);

                    index.insert(geom.getEnvelopeInternal(), rec);
                }
            }
        }
        index.build();
    }

    public CountyRecord findCounty(double lon, double lat) {
        Point p = geometryFactory.createPoint(new Coordinate(lon, lat));

        List<CountyRecord> candidates = index.query(p.getEnvelopeInternal());

        for (CountyRecord rec : candidates) {
            if (rec.geometry != null && rec.geometry.covers(p))
                return rec;
        }
        return null;
    }

}
