package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;

@Repository
@RepositoryRestResource(exported = false)
public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByIdAndClient(Long orderId, Client client);
    boolean existsByIdAndServiceFreelancer(Long orderId, Freelancer freelancer);

    Page<Order> findByService_Freelancer(Freelancer serviceFreelancer, Pageable pageable);

    Page<Order> findByClient(Client client, Pageable pageable);

    Page<Order> findByService_FreelancerAndStatusIn(Freelancer serviceFreelancer, Collection<OrderStatus> statuses, Pageable pageable);

    Page<Order> findByClientAndStatusIn(Client client, Collection<OrderStatus> statuses, Pageable pageable);

    long countByService_FreelancerIdAndStatusAndUpdatedAtBetween(Long serviceFreelancerId, OrderStatus status, Instant updatedAtAfter, Instant updatedAtBefore);

    long countByService_FreelancerIdAndStatus(Long freelancerId, OrderStatus status);

    long countByService_FreelancerIdAndStatusIn(Long freelancerId, Collection<OrderStatus> statuses);
}
