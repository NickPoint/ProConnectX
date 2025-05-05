package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
public class Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Email
    @NotBlank
    private String email;

    @Column(nullable = false, length = 64)
    @NotBlank
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "principal_role", joinColumns = @JoinColumn(name = "principal_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    @NotEmpty
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private RoleType lastActiveRole =  RoleType.ROLE_UNVERIFIED;

    @OneToMany(mappedBy = "principal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Freelancer> freelancerAccounts = new ArrayList<>();

/*    @JoinColumn
    @OneToOne(mappedBy = "principal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Employer employer;*/

    @OneToMany(mappedBy = "principal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Client> clientAccounts = new ArrayList<>();
}
