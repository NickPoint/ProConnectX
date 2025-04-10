package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(CategoryType name);

    Boolean existsByName(CategoryType name);
}
