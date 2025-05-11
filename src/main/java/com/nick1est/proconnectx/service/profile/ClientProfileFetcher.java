package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientProfileFetcher implements AccountProfileFetcher {
    private final ClientProfileService clientProfileService;


    @Override
    public ProfileType getSupportedProfileType() {
        return ProfileType.CLIENT;
    }

    @Override
    public Profile fetchById(Long profileId) {
        return clientProfileService.getProfileById(profileId);
    }
}

