package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ServiceDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface ServiceRepository extends JpaRepository<ServiceDao, Long> {
    @Query("SELECT service FROM ServiceDao service " +
            "WHERE (:title is null or service.title ILIKE %:title%) " +
            "and (:categories is null or service.category in :categories) " +
            "and (:location is null or service.location = :location) " +
            "and (:rating is null or service.ratingCount > 5 and service.rating >= :rating or service.ratingCount <= 5) " +
            "and (:minPrice is null or service.price >= :minPrice) and (:maxPrice is null or service.price <= :maxPrice)")
    List<ServiceDao> findByTitleAndCategoryAndLocationAndRatingAndPrice(@Param("title") String title,
                                                                        @Param("categories") List<Category> categories,
                                                                        @Param("location") String location,
                                                                        @Param("rating") Double rating,
                                                                        @Param("minPrice") Double minPrice,
                                                                        @Param("maxPrice") Double maxPrice);

}
