package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Address;
import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByIdAndClient(Long orderId, Client client);
    boolean existsByIdAndServiceFreelancer(Long orderId, Freelancer freelancer);

    List<Order> findByService_Freelancer(Freelancer serviceFreelancer);
}
