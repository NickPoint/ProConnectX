package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class CategoryMapper {
    @Autowired
    private CategoryService categoryService;

    public List<Category> toDaoList(List<CategoryType> categories) {
        if (categories != null) {
            //TODO: Bad query, replace with one call to database
            return categories.stream().map(this::toDao).collect(Collectors.toList());
        }
        return null;
    }

    public List<CategoryType> toDtoList(List<Category> categories) {
        if (categories != null) {
            return categories.stream().map(this::toDto).collect(Collectors.toList());
        }
        return null;
    }

    public Category toDao(CategoryType category) {
        return categoryService.findByName(category);
    }

    public CategoryType toDto(Category category) {
        return category.getName();
    }

}
