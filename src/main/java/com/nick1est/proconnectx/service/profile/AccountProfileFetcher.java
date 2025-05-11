package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dao.ProfileType;

public interface AccountProfileFetcher {
    ProfileType getSupportedProfileType();
    Profile fetchById(Long profileId);
}
