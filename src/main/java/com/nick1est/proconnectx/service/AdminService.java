package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.BaseProfile;
import com.nick1est.proconnectx.dao.ProfileStatus;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.RoleType;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.events.domain.ProfileRejectedEvent;
import com.nick1est.proconnectx.events.domain.ProfileVerifiedEvent;
import com.nick1est.proconnectx.mapper.ClientMapperGeneric;
import com.nick1est.proconnectx.mapper.FreelancerMapperGeneric;
import com.nick1est.proconnectx.repository.ClientRepository;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.repository.UserRepository;
import com.nick1est.proconnectx.service.profile.ClientProfileService;
import com.nick1est.proconnectx.service.profile.FreelancerProfileService;
import com.nick1est.proconnectx.service.profile.ProfileResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminService {
    private final FreelancerProfileService freelancerProfileService;
    private final ClientProfileService clientProfileService;
    private final FreelancerRepository freelancerRepository;
    private final ClientRepository clientRepository;
    private final FreelancerMapperGeneric freelancerMapper;
    private final ClientMapperGeneric clientMapper;
    private final ProfileResolver profileResolver;
    private final Map<ProfileType, RoleType> profileTypeRoleTypeMap;
    private final RoleService roleService;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher events;

    public List<RegistrationRequestDto> getFreelancersRegistrationRequests(ProfileStatus profileStatus) {
        val freelancers = freelancerRepository.findAll();
        return freelancerMapper.toRegistrationRequestDto(freelancers);
    }

    public List<RegistrationRequestDto> getClientsRegistrationRequests(ProfileStatus profileStatus) {
        val clients = clientRepository.findAll(); // TODO: Pageable, sortable
        return clientMapper.toRegistrationRequestDto(clients);
    }

    @Transactional
    public void approveRegistrationRequest(Long profileId, ProfileType profileType, UserDetailsImpl userDetails) {
        val profile = profileResolver.resolve(profileId, profileType);
        val role = profileTypeRoleTypeMap.get(profileType);
        val roles = profile.getUser().getRoles();
        roles.remove(roleService.getByName(RoleType.ROLE_UNVERIFIED));
        roles.add(roleService.getByName(role));
        profile.setProfileStatus(ProfileStatus.ACTIVE);
        events.publishEvent(new ProfileVerifiedEvent(profileId, profileType));
    }

    @Transactional
    public void rejectRegistrationRequest(Long profileId, ProfileType profileType, String reason, UserDetailsImpl userDetails) {
        val profile = (BaseProfile) profileResolver.resolve(profileId, profileType);
        log.debug("Rejecting registration request for {}: {} by admin: {}", profileType, profileId, userDetails.getUser().getId());
        profile.setRejectionReason(reason);
        profile.setProfileStatus(ProfileStatus.REJECTED);
        events.publishEvent(new ProfileRejectedEvent(profileId, profileType, reason));
    }
}
