package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Freelancer extends BaseProfile {
    protected String firstName;
    protected String lastName;

    @Lob
    private String description;

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.PERSIST)
    protected List<File> files = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "freelancer_categories",
            joinColumns = @JoinColumn(name = "freelancer_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @Override
    public OwnerType getOwnerType() {
        return OwnerType.FREELANCER;
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
        return RoleType.ROLE_FREELANCER;
    }

    @Override
    public ProfileType getProfileType() {
        return ProfileType.FREELANCER;
    }
}
