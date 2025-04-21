package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.Principal;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findAllByOwnerId(@NotNull Long ownerId);
    Optional<File> findByIdAndOwnerId(Long fileId, Long ownerId);
}
