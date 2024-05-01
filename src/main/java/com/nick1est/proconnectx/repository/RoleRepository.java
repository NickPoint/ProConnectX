package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.ERole;
import com.nick1est.proconnectx.dao.Role;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(@NonNull ERole name);

}
