package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.ProfileStatus;
import com.nick1est.proconnectx.dao.ProfileType;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class ProfileInfo {
    @NotNull
    Long profileId;
    @NotNull
    ProfileType profileType;
    @NotNull
    ProfileStatus status;
    @NotNull
    String displayName;
}
