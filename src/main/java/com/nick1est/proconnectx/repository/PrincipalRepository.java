package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Principal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface PrincipalRepository extends JpaRepository<Principal, Long> {

    Optional<Principal> findByEmail(String name);
    Boolean existsByEmail(String name);

}
