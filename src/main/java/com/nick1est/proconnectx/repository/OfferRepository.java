package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface OfferRepository extends JpaRepository<Offer, Long> {
    @Query("SELECT offer FROM Offer offer " +
            "WHERE (:categories is null or offer.category in :categories) " +
            "and (:location is null or offer.location = :location) " +
            "and (:rating is null or offer.rating >= :rating) " +
            "and (:minPrice is null or offer.price >= :minPrice) and (:maxPrice is null or offer.price <= :maxPrice)")
    List<Offer> findByFieldAndLocationAndRatingAndPrice(@Param("categories") List<Category> categories,
                                                        @Param("location") String location,
                                                        @Param("rating") Double rating,
                                                        @Param("minPrice") Double minPrice,
                                                        @Param("maxPrice") Double maxPrice);

}
