package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Dispute;
import com.nick1est.proconnectx.dao.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    boolean existsByIdAndOrder_Service_Freelancer(Long id, Freelancer orderServiceFreelancer);

    boolean existsByIdAndOrder_Client(Long id, Client orderClient);
}
