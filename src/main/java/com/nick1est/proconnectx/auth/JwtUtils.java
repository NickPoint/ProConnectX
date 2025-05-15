package com.nick1est.proconnectx.auth;

import com.nick1est.proconnectx.config.JwtCookieProperties;
import com.nick1est.proconnectx.dao.ProfileType;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
@Getter
public class JwtUtils {

    private final JwtCookieProperties jwtCookieProperties;
    @Value("${proConnectX.app.jwtSecret}")
    private String jwtSecret;

    @Value("${proConnectX.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${proConnectX.app.jwtCookieName}")
    @Getter
    private String jwtCookie;

    public JwtUtils(JwtCookieProperties jwtCookieProperties) {
        this.jwtCookieProperties = jwtCookieProperties;
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, jwtCookie);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }

    public String generateToken(String username, ProfileType profileType) {
        log.debug("Generating token for username {}", username);
        return Jwts.builder()
                .subject(username)
                .claim("activeProfile", profileType.toString())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key())
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public ProfileType getProfileTypeFromToken(String token) {
        return ProfileType.valueOf(Jwts.parser().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().get("activeProfile", String.class));
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}