package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ECategory;
import com.nick1est.proconnectx.service.CategoryService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class CommonMapper {

    @Autowired
    protected CategoryService categoryService;

    public List<Category> mapECategoriesToCategories(List<ECategory> categories) {
        if (categories != null) {
            return categories.stream().map(this::mapECategoryToCategory).collect(Collectors.toList());
        }
        return null;
    }

    public Category mapECategoryToCategory(ECategory category) {
        return categoryService.findByName(category);
    }

    public ECategory map(Category category) {
        return category.getName();
    }

}
