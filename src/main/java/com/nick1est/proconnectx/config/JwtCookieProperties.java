package com.nick1est.proconnectx.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt.cookie")
@Data
public class JwtCookieProperties {
    private boolean secure;
    private String sameSite;
}