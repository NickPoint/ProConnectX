package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.repository.UserRepository;
import com.nick1est.proconnectx.service.UserService;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ProfileResolver {
    private final Map<ProfileType, Function<User, Profile>> resolvers;
    private final Map<ProfileType, AccountProfileFetcher> fetchers;
    private final UserRepository userRepository;

    @Autowired
    public ProfileResolver(List<AccountProfileExtractor> extractors,
                           List<AccountProfileFetcher> fetchers, UserRepository userRepository) {
        this.resolvers = extractors.stream()
                .collect(Collectors.toMap(
                        AccountProfileExtractor::getSupportedProfile,
                        AccountProfileExtractor::extractProfile
                ));
        this.fetchers = fetchers.stream()
                .collect(Collectors.toMap(
                        AccountProfileFetcher::getSupportedProfileType,
                        Function.identity()
                ));
        this.userRepository = userRepository;
    }

    public Profile resolve(User user) {
        val lastProfile = user.getLastActiveProfile();
        if (lastProfile == ProfileType.ADMIN) {
            return new Admin(user);
        }
        Function<User, Profile> fn = resolvers.get(lastProfile);
        if (fn != null) {
            Profile profile = fn.apply(user);
            if (profile != null) {
                return profile;
            }
        }

        // fallback: first non-null profile matching any role
        return user.getRoles().stream()
                .map(Role::getName)
                .map(resolvers::get)
                .filter(Objects::nonNull)
                .map(fn2 -> fn2.apply(user))
                .filter(Objects::nonNull)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active profile"));
    }

    /**
     * Get's profile from right repository
     * @param profileId NB! when type is Admin, then should be userId
     */
    public Profile resolve(Long profileId, ProfileType type) {
        if (type == ProfileType.ADMIN) {
            return new Admin(userRepository.findById(profileId)
                    .orElseThrow(() -> new NotFoundException("error.admin.not_found",  profileId)));
        }
        AccountProfileFetcher fetcher = fetchers.get(type);
        if (fetcher == null) {
            throw new IllegalArgumentException("Unsupported account type: " + type);
        }
        return fetcher.fetchById(profileId);
    }
}
