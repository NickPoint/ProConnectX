package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    @Query("SELECT freelancer FROM Freelancer freelancer " +
            "WHERE (:firstName is null or freelancer.firstName ILIKE %:firstName%) " +
            "AND (:lastName is null or freelancer.lastName ILIKE %:lastName%) " +
            "AND (:categories is null or EXISTS (SELECT 1 FROM freelancer.categories category WHERE category IN :categories)) " +
            "AND (:country is null or freelancer.address.country = :country) " +
            "AND (:city is null or freelancer.address.city = :city) " +
            "AND (:rating is null or freelancer.ratingCount > 5 and freelancer.rating >= :rating or freelancer.ratingCount <= 5)")
    List<Freelancer> findByNameAndFieldAndLocationAndRating(@Param("firstName") String firstName,
                                                        @Param("lastName") String lastName,
                                                        @Param("categories") List<Category> categories,
                                                        @Param("country") String country,
                                                        @Param("city") String city,
                                                        @Param("rating") Double rating);

    List<Freelancer> findByAccountStatus(@NotNull AccountStatus accountStatus);
}
