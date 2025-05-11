package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;

@Repository
@RepositoryRestResource(exported = false)
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    boolean existsByIdAndClientId(Long orderId, Long clientId);
    boolean existsByIdAndFreelancerId(Long orderId, Long freelancerId);

    Page<Order> findByFreelancer(Freelancer serviceFreelancerProfile, Pageable pageable);

    Page<Order> findByClient(Client client, Pageable pageable);

    Page<Order> findByFreelancerIdAndStatusIn(Long freelancerId, Collection<OrderStatus> statuses, Pageable pageable);

    Page<Order> findByClientIdAndStatusIn(Long clientProfileId, Collection<OrderStatus> statuses, Pageable pageable);

    long countByFreelancerIdAndStatusAndUpdatedAtBetween(Long freelancerId, OrderStatus status, Instant updatedAtAfter, Instant updatedAtBefore);

    long countByFreelancerIdAndStatus(Long freelancerId, OrderStatus status);

    long countByFreelancerIdAndStatusIn(Long freelancerId, Collection<OrderStatus> statuses);

    long countByClientIdAndStatusAndUpdatedAtBetween(Long clientId, @NotNull OrderStatus status, @NotNull Instant updatedAtAfter, @NotNull Instant updatedAtBefore);

    boolean existsByIdAndService(Long id, @NotNull Service service);
}
