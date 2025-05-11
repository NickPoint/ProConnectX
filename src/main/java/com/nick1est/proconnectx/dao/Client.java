package com.nick1est.proconnectx.dao;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Client extends BaseProfile {
    protected String firstName;
    protected String lastName;

    @OneToMany(mappedBy = "client", cascade = CascadeType.PERSIST)
    protected List<File> files = new ArrayList<>();

    @Override
    public OwnerType getOwnerType() {
        return OwnerType.CLIENT;
    }


    @Override
    public String getDisplayName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return "Rookie";
    }

    @Override
    public RoleType getRoleType() {
        return RoleType.ROLE_CLIENT;
    }

    @Override
    public ProfileType getProfileType() {return ProfileType.CLIENT;}
}
