package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.service.CategoryService;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class CommonMapper {

    @Autowired
    protected CategoryService categoryService;

    public List<Category> mapECategoriesToCategories(List<CategoryType> categories) {
        if (categories != null) {
            return categories.stream().map(this::mapECategoryToCategory).collect(Collectors.toList());
        }
        return null;
    }

    public Category mapECategoryToCategory(CategoryType category) {
        return categoryService.findByName(category);
    }

    public CategoryType map(Category category) {
        return category.getName();
    }

}
