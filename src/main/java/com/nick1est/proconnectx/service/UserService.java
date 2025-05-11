package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.exception.EmailAlreadyExistsException;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.profile.GenericProfileMapper;
import com.nick1est.proconnectx.mapper.profile.ProfileMapper;
import com.nick1est.proconnectx.repository.UserRepository;
import com.nick1est.proconnectx.service.profile.AbstractProfileService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final Map<ProfileType, AbstractProfileService<?, ?, ?>> profileServiceMap;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final ProfileMapper profileMapper;

    @Transactional
    public AuthResponse signInUser(LoginRequest loginRequest) {
        val authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        val userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return buildAuthResponse(userDetails);
    }

    @Transactional
    public AuthResponse signupUser(SignupFormRequest signupFormRequest) {
        if (userRepository.existsByEmail(signupFormRequest.getEmail())) {
            throw new EmailAlreadyExistsException(signupFormRequest.getEmail());
        }

        val user = new User(signupFormRequest.getEmail(),
                passwordEncoder.encode(signupFormRequest.getPassword()));
        user.getRoles().add(roleService.getByName(RoleType.ROLE_UNVERIFIED));
        createProfile(user, signupFormRequest.getProfileType());

        return signInUser(new LoginRequest(signupFormRequest.getEmail(), signupFormRequest.getPassword()));
    }

    @Transactional
    public void createProfile(Long userId, ProfileType profileType) {
        val user = getById(userId);
        createProfile(user, profileType);
    }

    private void createProfile(User user, ProfileType profileType) {
        profileServiceMap.get(profileType).initProfile(user);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("error.principal.not_found", userId));
    }

    public List<RegistrationRequestDto> getRegistrationRequest(Long userId) {
        val user = getById(userId);
        List<BaseProfile> list = new ArrayList<>();
        list.addAll(user.getClients());
        list.addAll(user.getFreelancers());
        return list.stream().map(profileMapper::toRegistrationRequestDto).toList();
    }

    public List<Profile> getAllActiveProfiles(Long userId) {
        val user = getById(userId);
        List<Profile> list = new ArrayList<>(2);
        user.getClients().stream().findFirst().ifPresent(list::add);
        user.getFreelancers().stream().findFirst().ifPresent(list::add);
        return list;
    }

    public AuthResponse buildAuthResponse(UserDetailsImpl ud) {
        List<ProfileInfo> infos = getAllActiveProfiles(ud.getUser().getId()).stream()
                .map(p -> new ProfileInfo(
                        p.getId(),
                        p.getProfileType(),
                        p.getProfileStatus(),
                        p.getDisplayName()
                )).toList();

        Profile active = ud.getActiveProfile();
        ProfileInfo activeInfo = new ProfileInfo(
                active.getId(),
                active.getProfileType(),
                active.getProfileStatus(),
                active.getDisplayName());

        val profileService = profileServiceMap.get(active.getProfileType());
        return new AuthResponse(
                ud.getUsername(),
                ud.getUser().getRoles().stream()
                        .map(Role::getName).collect(Collectors.toSet()),
                activeInfo,
                infos,
                profileService != null ? profileService.getAvatarUrl(active.getId()) : null //TODO: Maybe there is better variant to handle that admin doesn't have profileService
        );
    }

}
