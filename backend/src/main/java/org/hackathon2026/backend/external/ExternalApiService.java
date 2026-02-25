package org.hackathon2026.backend.external;

import org.apache.coyote.BadRequestException;
import org.hackathon2026.backend.dto.GetTaxRateDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Service
public class ExternalApiService {

    private final RestClient restClient;

    public ExternalApiService(RestClient restClient) {
        this.restClient = restClient;
    }

    public GetTaxRateDto getTaxRate(float latitude, float longitude) throws BadRequestException {
        try {
            return restClient.get()
                    .uri("https://api.zip-tax.com/request/v60?key={key}&lat={lat}&lng={lng}&format=json",
                            "ziptax_sk_fPsRCWB5vDrtSzOTj8RV7Vv2kD1gPyQa",
                            latitude,
                            longitude)
                    .retrieve()
                    .body(GetTaxRateDto.class);
        } catch (HttpClientErrorException.UnprocessableContent errorException) {
            throw new BadRequestException("Not found any info about tax");
        }
    }
}