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

    public record InfoRecord(
            Geometry geometry,
            String name,
            SimpleFeature feature
    ) {}

    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final STRtree index = new STRtree();
    private final List<InfoRecord> all = new ArrayList<>();

    public GeoJsonRead(File geoJsonFile, String propertyName) throws Exception {
        FeatureJSON fjson = new FeatureJSON();
        try (FileInputStream fis = new FileInputStream(geoJsonFile)) {
            SimpleFeatureCollection fc = (SimpleFeatureCollection) fjson.readFeatureCollection(fis);

            try (SimpleFeatureIterator it = fc.features()) {
                while (it.hasNext()) {
                    SimpleFeature feature = it.next();

                    Object geomObj = feature.getDefaultGeometry();
                    if (!(geomObj instanceof Geometry)) continue;

                    Geometry geom = (Geometry) geomObj;

                    Object nameObj = feature.getAttribute(propertyName);
                    String countyName = nameObj != null ? nameObj.toString() : "UNKNOWN";

                    InfoRecord rec = new InfoRecord(geom, countyName, feature);
                    all.add(rec);

                    index.insert(geom.getEnvelopeInternal(), rec);
                }
            }
        }
        index.build();
    }

    public InfoRecord find(double lon, double lat) {
        Point p = geometryFactory.createPoint(new Coordinate(lon, lat));

        List<InfoRecord> candidates = index.query(p.getEnvelopeInternal());

        for (InfoRecord rec : candidates) {
            if (rec.geometry != null && rec.geometry.covers(p))
                return rec;
        }
        return null;
    }

}
