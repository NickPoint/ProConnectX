package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.JwtUtils;
import com.nick1est.proconnectx.config.JwtCookieProperties;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthCookieService {
    @Value("${proConnectX.app.jwtCookieName}")
    private String jwtCookieName;

    private final JwtUtils jwtUtils;
    private final JwtCookieProperties jwtCookieProperties;

    public ResponseCookie createCookie(String email, ProfileType profileType) {
        String token = jwtUtils.generateToken(email, profileType);
        return ResponseCookie.from(jwtCookieName, token)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofMillis(jwtUtils.getJwtExpirationMs()))
                .secure(jwtCookieProperties.isSecure())
                .sameSite(jwtCookieProperties.getSameSite())
                .build();
    }

    public Optional<ResponseCookie> refreshCookieIfNeeded(
            String incomingCookie,
            ProfileType currentProfileType,
            String email
    ) {
        // no valid cookie at all → issue fresh
        log.debug("Refreshing cookie for {}, incomingCookie: {}", email, incomingCookie);
        if (incomingCookie == null || !jwtUtils.validateToken(incomingCookie)) {
            return Optional.of(createCookie(email, currentProfileType));
        }

        ProfileType cookieProfileType = jwtUtils.getProfileTypeFromToken(incomingCookie);
        if (!cookieProfileType.equals(currentProfileType)) {
            // role/scope changed → reissue
            return Optional.of(createCookie(email, currentProfileType));
        }
        return Optional.empty();
    }

    public ResponseCookie clearCookie() {
        return ResponseCookie.from(jwtCookieName, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .secure(jwtCookieProperties.isSecure())
                .sameSite(jwtCookieProperties.getSameSite())
                .build();
    }
}

