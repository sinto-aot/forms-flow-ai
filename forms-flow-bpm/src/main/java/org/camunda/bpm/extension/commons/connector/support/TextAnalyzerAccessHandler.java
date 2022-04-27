package org.camunda.bpm.extension.commons.connector.support;

import com.google.gson.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import static org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction.clientRegistrationId;

@Service("textAnalyzerAccessHandler")
public class TextAnalyzerAccessHandler implements IAccessHandler{

    private final Logger LOGGER = LoggerFactory.getLogger(TextAnalyzerAccessHandler.class);

    @Autowired
    private WebClient webClient;

    @Override
    public ResponseEntity<String> exchange(String url, HttpMethod method, String payload) {

        payload = (payload == null) ? new JsonObject().toString() : payload;

        Mono<ResponseEntity<String>> entityMono = webClient.method(method).uri(url)
                .attributes(clientRegistrationId("keycloak-client"))
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(Mono.just(payload), String.class)
                .retrieve()
                .toEntity(String.class);

        ResponseEntity<String> response = entityMono.block();
        return new ResponseEntity<>(response.getBody(), response.getStatusCode());
    }
}