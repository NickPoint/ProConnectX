package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.BidStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findAllByBidderId(Long ownerId);

    @Query("SELECT bid FROM Bid bid " +
            "WHERE (:projectId is null or bid.project.id = :projectId) " +
            "and (:rating is null or bid.bidder.rating = :rating) " +
            "and (:firstName is null or bid.bidder.principal.firstName ILIKE %:firstName%) " +
            "and (:lastName is null or bid.bidder.principal.lastName ILIKE %:lastName%) " +
            "and (:minPrice is null or bid.amount >= :minPrice) " +
            "and (:maxPrice is null or bid.amount <= :maxPrice) " +
            "and (:statuses is null or bid.status in :statuses)")
    List<Bid> filterBids(@Param("projectId") Long projectId,
                         @Param("rating") Integer rating,
                         @Param("firstName") String firstName,
                         @Param("lastName") String lastName,
                         @Param("minPrice") Integer minPrice,
                         @Param("maxPrice") Integer maxPrice,
                         @Param("statuses") List<BidStatus> statuses);
}
