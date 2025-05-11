package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FreelancerProfileFetcher implements AccountProfileFetcher {
    private final FreelancerProfileService freelancerProfileService;


    @Override
    public ProfileType getSupportedProfileType() {
        return ProfileType.FREELANCER;
    }

    @Override
    public Profile fetchById(Long profileId) {
        return freelancerProfileService.getProfileById(profileId);
    }
}

