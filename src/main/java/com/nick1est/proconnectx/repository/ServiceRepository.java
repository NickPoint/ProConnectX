package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface ServiceRepository extends JpaRepository<Service, Long>, JpaSpecificationExecutor<Service> {
    boolean existsByIdAndFreelancer(Long id, Freelancer freelancer);
}
