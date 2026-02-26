package org.hackathon2026.backend.jsonTools;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hackathon2026.backend.models.CountyInfo;

public class CountyJsonRead {

    public static CountyInfo getCountyInfo(String countyCode, String filePath) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(new java.io.File(filePath));

        return mapper.readValue(root.get(countyCode).toString(), CountyInfo.class);
    }

}
