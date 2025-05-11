package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dao.Role;
import com.nick1est.proconnectx.dao.User;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
@RepositoryRestResource(exported = false)
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String name);
    Boolean existsByEmail(String name);

    @Modifying
    @Query("UPDATE User u SET u.lastActiveProfile = :profileType WHERE u.id = :id")
    void updateLastActiveProfile(Long id, ProfileType profileType);

    List<User> findAllByLastActiveProfile(ProfileType profileType);
}
