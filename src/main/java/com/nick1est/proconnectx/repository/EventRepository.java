package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findEventsByOrderId(Long orderId);
}
