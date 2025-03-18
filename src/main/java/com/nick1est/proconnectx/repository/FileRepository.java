package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Principal;
import com.nick1est.proconnectx.dao.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<UploadedFile, Long> {
    List<UploadedFile> findAllByPrincipal(Principal principal);
}
