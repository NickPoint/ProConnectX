package com.nick1est.proconnectx.auth;

import com.nick1est.proconnectx.repository.PrincipalRepository;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    PrincipalRepository principalRepository;

    @Override
    @Transactional
    public UserDetailsImpl loadUserByUsername(String email) {
        val user = principalRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Principal with username: " + email  + " not found"));
        return UserDetailsImpl.build(user);
    }

}
