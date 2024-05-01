package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.checkerframework.common.value.qual.IntRange;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class Client {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    @NotBlank
    @NonNull
    private String name;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Email
    @NonNull
    private String email;

    @Column(nullable = false, length = 64)
    @NotBlank
    @NonNull
    private String password;

    @Column(length = 20)
    private String username;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    private String profilePicture;

    private String location; //TODO: Should be an enum?

    @IntRange(from = 0, to = 5)
    private Double rating;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_categories", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

//    public Client(String username, String email, String password) {
//        this.username = username;
//        this.email = email;
//        this.password = password;
//    }
//
//    public Client(String name, String email, String password, String username, Set<Role> roles, String profilePicture, String location, @IntRange(from = 0, to = 5) Double rating) {
//        this.name = name;
//        this.email = email;
//        this.password = password;
//        this.username = username;
//        this.roles = roles;
//        this.profilePicture = profilePicture;
//        this.location = location;
//        this.rating = rating;
//    }
}
