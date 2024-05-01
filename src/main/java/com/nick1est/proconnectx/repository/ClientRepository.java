package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByUsername(String email);
    Optional<Client> findByEmail(String name);
    Boolean existsByUsername(String email);
    Boolean existsByEmail(String name);

    @Query("SELECT client FROM Client client JOIN client.roles role " +
            "WHERE (:fields is null or :categories member of client.categories ) " +
            "AND (:location is null or client.location = :location) " +
            "AND (:rating is null or client.rating >= :rating)" +
            "AND (:role is null or :role = role)")
    List<Client> findByFieldAndLocationAndRatingAndRoles(@Param("categories") List<Category> categories,
                                                        @Param("location") String location,
                                                        @Param("rating") Double rating,
                                                        @Param("role") Role role);

}
