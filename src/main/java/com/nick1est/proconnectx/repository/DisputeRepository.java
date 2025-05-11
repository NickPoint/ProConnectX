package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    boolean existsByIdAndOrder_FreelancerId(Long id, Long freelancerProfileId);

    boolean existsByIdAndOrder_ClientId(Long id, Long clientProfileId);
}
