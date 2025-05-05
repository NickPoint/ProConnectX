package com.nick1est.proconnectx.events;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record FreelancerRegisteredEvent(@NotNull Long freelancerId, @NotEmpty String fullName, String avatarImageUrl) {
}