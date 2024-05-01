package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.Category;
import lombok.Data;
import org.springframework.data.domain.Range;

import java.util.List;

@Data
public class OfferFilter {
    private List<Category> categories;
    private String location;
    private Double rating;
    private Range<Double> price;
}
