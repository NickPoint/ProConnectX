package com.nick1est.proconnectx.dao;

import java.util.List;

public interface Profile extends Rating {
    Long getId();
    User getUser();
    String getDisplayName();
    RoleType getRoleType();
    ProfileType getProfileType();
    List<File> getFiles();
    void setFiles(List<File> files);
    ProfileStatus getProfileStatus();
    void setProfileStatus(ProfileStatus status);
    String getEmail();

    default void updateStatus(ProfileStatus newStatus) {
        if (!getProfileStatus().canTransitionTo(newStatus)) {
            throw new IllegalStateException("ProfileStatus can't transition to ProfileStatus " + newStatus);
        }
        setProfileStatus(newStatus);
    }

}
