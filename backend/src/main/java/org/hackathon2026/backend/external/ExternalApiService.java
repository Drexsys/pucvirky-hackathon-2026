package org.hackathon2026.backend.external;

import org.hackathon2026.backend.dto.BaseRates;
import org.hackathon2026.backend.dto.GetTaxRateDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class ExternalApiService {

    private final RestClient restClient;

    public ExternalApiService(RestClient restClient) {
        this.restClient = restClient;
    }

    public List<BaseRates> getTaxRate(float latitude, float longitude) {
        return restClient.get()
                .uri("https://api.zip-tax.com/request/v60?key={key}&lat={lat}&lng={lng}&format=json",
                        "ziptax_sk_fPsRCWB5vDrtSzOTj8RV7Vv2kD1gPyQa",
                        latitude,
                        longitude)
                .retrieve()
                .body(GetTaxRateDto.class).getBaseRates();
    }
}