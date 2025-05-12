package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.web.PageableArgumentResolver;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findAllByServiceId(Long serviceId, Pageable pageable);
    Page<Review> findAllByClientId(Long serviceId, Pageable pageable);
}
