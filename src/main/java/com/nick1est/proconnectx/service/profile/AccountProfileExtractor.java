package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.User;

import java.util.function.Function;

public interface AccountProfileExtractor {
    ProfileType getSupportedProfile();
    Function<User, Profile> extractProfile();
}
