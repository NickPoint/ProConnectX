package com.nick1est.proconnectx.auth;

import com.nick1est.proconnectx.repository.ClientRepository;
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
    ClientRepository clientRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        val user = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Client Not Found with username: " + email));
        return UserDetailsImpl.build(user);
    }

}
