package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.DocumentType;
import com.nick1est.proconnectx.dao.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByFreelancerIdAndDocumentType(Long freelancerId, DocumentType documentType);
//    List<File> findAllByOwnerId(@NotNull Long ownerId);
//    Optional<File> findByIdAndOwnerIdAndOwnerType(Long id, @NotNull Long ownerId, @NotNull OwnerType ownerType);
}
