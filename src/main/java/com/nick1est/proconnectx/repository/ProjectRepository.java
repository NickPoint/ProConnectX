/*
package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dao.ProjectType;
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

    List<Project> findByEmployerId(Long employerId);

    @Query("SELECT project FROM Project project " +
            "WHERE (:title is null or project.title ILIKE %:title%) " +
            "AND (:categories is null or EXISTS (SELECT 1 FROM project.categories category WHERE category IN :categories)) " +
            "and (:location is null or project.location = :location) " +
            "and (:minBudget is null or project.budget >= :minBudget " +
            "       or exists (select 1 from project.bids bid where bid.amount >= :minBudget)) " +
            "and (:maxBudget is null or project.budget <= :maxBudget " +
            "       or exists (select 1 from project.bids bid where bid.amount <= :maxBudget))" +
            "and (:type is null or project.projectType = :type)")
    List<Project> findByFieldAndLocationAndPriceAndType(@Param("title") String title,
                                                 @Param("categories") List<Category> categories,
                                                 @Param("location") String location,
                                                 @Param("minBudget") Double minBudget,
                                                 @Param("maxBudget") Double maxBudget,
                                                 @Param("type") ProjectType type);
}
*/
