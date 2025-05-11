package com.nick1est.proconnectx.auth;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.repository.UserRepository;
import com.nick1est.proconnectx.service.profile.ProfileResolver;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final ProfileResolver profileResolver;

    @Override
    @Transactional
    public UserDetailsImpl loadUserByUsername(String email) {
        val user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User with username: " + email  + " not found"));
        Profile active = profileResolver.resolve(user);
        return new UserDetailsImpl(user, active);
    }

}
