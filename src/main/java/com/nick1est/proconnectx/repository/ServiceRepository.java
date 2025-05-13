package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface ServiceRepository extends JpaRepository<Service, Long>, JpaSpecificationExecutor<Service> {
    boolean existsByIdAndFreelancerId(Long id, Long freelancerId);

    @Modifying
    @Query("update Service s set s.ratingSum = s.ratingSum + :newRating, s.ratingCount = s.ratingCount + 1 where s.id = :serviceId")
    void updateRating(Long serviceId, Double newRating);

    @Modifying
    @Query("""
            UPDATE Service s 
              SET s.rating = CASE
                  WHEN s.ratingCount > 0 
                    THEN ROUND(s.ratingSum * 1.0 / s.ratingCount, 1)
                  ELSE 0.0
                END
            WHERE s.id = :serviceId
            """)
    void updateRatingAverage(Long serviceId);
}
