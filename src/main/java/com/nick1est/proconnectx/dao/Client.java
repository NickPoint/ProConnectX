package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.checkerframework.common.value.qual.IntRange;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@RequiredArgsConstructor
public class Client {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Email
    private String email;

    @Column(nullable = false, length = 64)
    @NotBlank
    private String password;

    @ManyToMany
    @JoinTable(name = "client_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    private String profilePicture;

    private String location; //TODO: Should be an enum?

    @IntRange(from = 0, to = 5)
    private Double rating;

}
