package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByTitle(String title);

    @Query("SELECT p FROM Project p " +
            "LEFT JOIN p.freelancer f " +
            "LEFT JOIN p.bids pr " +
            "WHERE f.id = :freelancerId OR pr.freelancer.id = :freelancerId")
    List<Project> findByFreelancerId(Long freelancerId);

    @Query("SELECT project FROM Project project " +
            "WHERE (:categories is null or project.category in :categories) " +
            "and (:location is null or project.location = :location) " +
            "and (:minBudget is null or project.budget >= :minBudget) and (:maxBudget is null or project.budget <= :maxBudget)")
    List<Project> findByFieldAndLocationAndPrice(@Param("categories") List<Category> categories,
                                                 @Param("location") String location,
                                                 @Param("minBudget") Double minBudget,
                                                 @Param("maxBudget") Double maxBudget);
}
