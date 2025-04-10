package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category findByName(CategoryType category) {
        return categoryRepository.findByName(category).orElseThrow(() -> new RuntimeException("Category not found"));
    }
}
