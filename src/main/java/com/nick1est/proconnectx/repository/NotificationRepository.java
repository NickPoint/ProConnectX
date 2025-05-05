package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Notification;
import com.nick1est.proconnectx.dao.NotificationStatus;
import com.nick1est.proconnectx.dao.Principal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Optional<Notification> findByIdAndPrincipal(Long id, Principal principal);

    List<Notification> findByStatus(NotificationStatus status);
}
