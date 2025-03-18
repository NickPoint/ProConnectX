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
    public UserDetailsImpl loadUserByUsername(String email) throws UsernameNotFoundException {
        val user = principalRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Person Not Found with username: " + email));
        return UserDetailsImpl.build(user);
    }

}
