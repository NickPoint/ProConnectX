package com.nick1est.proconnectx.auth;

import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.repository.PrincipalRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Profile("default")
@Slf4j
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {

    private final PrincipalRepository principalRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        log.debug("doFilterInternal");
        if (SecurityContextHolder.getContext().getAuthentication() == null) {

            val principal = principalRepository.findById(1L).orElseThrow(
                    () -> new RuntimeException("Principal not found")
            );
            UserDetailsImpl fakeUser = UserDetailsImpl.build(principal);
            fakeUser.setActiveRoleType(RoleType.ROLE_FREELANCER);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            fakeUser,
                            null,
                            fakeUser.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}