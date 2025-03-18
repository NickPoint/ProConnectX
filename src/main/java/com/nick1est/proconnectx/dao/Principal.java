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

    @Column(nullable = false)
    @NotBlank
    @NonNull
    private String firstName;

    @Column(nullable = false)
    @NotBlank
    @NonNull
    private String lastName;

    @Column(nullable = false, length = 64)
    @NotBlank
    @NonNull
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "client_roles", joinColumns = @JoinColumn(name = "client_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @JoinColumn
    @OneToOne
    private Freelancer freelancer;

    @JoinColumn
    @OneToOne
    private Employer employer;

}
