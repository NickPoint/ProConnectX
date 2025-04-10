package com.nick1est.proconnectx.dao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Email
    @NonNull
    private String email;

    @Column(nullable = false, length = 64)
    @NotBlank
    @NonNull
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "client_roles", joinColumns = @JoinColumn(name = "client_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @JoinColumn
    @OneToOne(mappedBy = "principal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Freelancer freelancer;

    @JoinColumn
    @OneToOne(mappedBy = "principal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Employer employer;

    @JoinColumn
    @OneToOne(mappedBy = "principal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Client client;
}
