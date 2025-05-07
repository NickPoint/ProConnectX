package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.OrderStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    boolean existsByIdAndClient(Long orderId, Client client);
    boolean existsByIdAndFreelancer(Long orderId, Freelancer freelancer);

    Page<Order> findByFreelancer(Freelancer serviceFreelancer, Pageable pageable);

    Page<Order> findByClient(Client client, Pageable pageable);

    Page<Order> findByService_FreelancerAndStatusIn(Freelancer serviceFreelancer, Collection<OrderStatus> statuses, Pageable pageable);

    Page<Order> findByClientAndStatusIn(Client client, Collection<OrderStatus> statuses, Pageable pageable);

    long countByFreelancerIdAndStatusAndUpdatedAtBetween(Long freelancerId, OrderStatus status, Instant updatedAtAfter, Instant updatedAtBefore);

    long countByFreelancerIdAndStatus(Long freelancerId, OrderStatus status);

    long countByFreelancerIdAndStatusIn(Long freelancerId, Collection<OrderStatus> statuses);

    long countByClientIdAndStatusAndUpdatedAtBetween(Long clientId, @NotNull OrderStatus status, @NotNull Instant updatedAtAfter, @NotNull Instant updatedAtBefore);
}
