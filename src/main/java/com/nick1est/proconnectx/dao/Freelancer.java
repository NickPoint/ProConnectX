package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

import java.time.Instant;
import java.util.List;

@Entity
@Getter
@Setter
public class Freelancer extends AbstractUser {

    @Lob
    private String description;

    @OneToMany(mappedBy = "freelancerId", cascade = CascadeType.PERSIST)
    protected List<File> files;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "freelancer_categories",
            joinColumns = @JoinColumn(name = "freelancer_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;
}
