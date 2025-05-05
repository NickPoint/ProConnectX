package com.nick1est.proconnectx.config;

import com.nick1est.proconnectx.auth.JwtUtils;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.auth.UserDetailsServiceImpl;
import com.nick1est.proconnectx.dao.RoleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            String jwt = jwtUtils.getJwtFromCookies(servletRequest.getServletRequest());

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                String activeRole = jwtUtils.getActiveRoleFromJwtToken(jwt);
                log.debug("Username from JWT: {}", username);
                log.debug("Active role from JWT: {}", activeRole);

                UserDetailsImpl userDetails = userDetailsService.loadUserByUsername(username);
                userDetails.setActiveRole(RoleType.valueOf(activeRole));

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}

