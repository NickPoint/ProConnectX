package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.ProfileStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByProfileStatus(@NotNull ProfileStatus profileStatus);
    List<Client> findByUserIdAndProfileStatus(Long userId, @NotNull ProfileStatus profileStatus);
}
