package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.dao.Profile;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.User;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class FreelancerProfileExtractor implements AccountProfileExtractor {
    @Override public ProfileType getSupportedProfile() {
        return ProfileType.FREELANCER;
    }
    @Override public Function<User, Profile> extractProfile() {
        return (user) -> user.getFreelancers().getLast();
    }
}
