package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Field;
import com.nick1est.proconnectx.dao.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByName(String projectName);

    @Query("SELECT p FROM Project p " +
            "LEFT JOIN p.freelancer f " +
            "LEFT JOIN p.proposals pr " +
            "WHERE f.id = :freelancerId OR pr.freelancer.id = :freelancerId")
    List<Project> findByFreelancerId(Long freelancerId);

    @Query("SELECT pj FROM Project pj " +
            "WHERE (:field is null or pj.field = :field) " +
            "and (:location is null or pj.location = :location) " +
            "and (:minPrice is null or pj.budget >= :minBudget) and (:maxPrice is null or pj.budget <= :maxBudget)")
    List<Project> findByFieldAndLocationAndPrice(@Param("field") Field field,
                                                 @Param("location") String location,
                                                 @Param("minBudget") Double minBudget,
                                                 @Param("maxBudget") Double maxBudget);
}
