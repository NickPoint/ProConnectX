package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.ProfileStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByProfileStatus(@NotNull ProfileStatus profileStatus);
    List<Client> findByUserIdAndProfileStatus(Long userId, @NotNull ProfileStatus profileStatus);

    @Modifying
    @Query("update Client c set c.ratingSum = c.ratingSum + :newRating, c.ratingCount = c.ratingCount + 1 where c.id = :clientId")
    void updateRating(Long clientId, Double newRating);

    @Modifying
    @Query("""
            UPDATE Client c 
              SET c.rating = CASE
                  WHEN c.ratingCount > 0 
                    THEN ROUND(c.ratingSum * 1.0 / c.ratingCount, 1)
                  ELSE 0.0
                END
            WHERE c.id = :clientId
            """)
    void updateRatingAverage(Long clientId);
}
