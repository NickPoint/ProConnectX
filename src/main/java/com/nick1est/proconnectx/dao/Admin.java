package com.nick1est.proconnectx.dao;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@RequiredArgsConstructor
public class Admin implements Profile {
    private final User user;

    @Override public Long getId() {
        return user.getId();
    }

    @Override
    public User getUser() {
        return null;
    }

    @Override public RoleType getRoleType() {
        return RoleType.ROLE_ADMIN;
    }

    @Override
    public ProfileType getProfileType() {
        return ProfileType.ADMIN;
    }

    @Override
    public List<File> getFiles() {
        return List.of();
    }

    @Override
    public void setFiles(List<File> files) {

    }

    @Override
    public BigDecimal getRating() {
        return null;
    }

    @Override
    public BigDecimal getRatingSum() {
        return null;
    }

    @Override
    public Long getRatingCount() {
        return 0L;
    }

    @Override
    public ProfileStatus getProfileStatus() {
        return ProfileStatus.ACTIVE;
    }

    @Override
    public void setProfileStatus(ProfileStatus status) {

    }

    @Override
    public String getEmail() {
        return user.getEmail();
    }

    @Override public String getDisplayName() {
        return "Administrator";
    }
}

