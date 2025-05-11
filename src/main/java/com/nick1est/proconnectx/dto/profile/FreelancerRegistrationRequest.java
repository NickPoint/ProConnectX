package com.nick1est.proconnectx.dto.profile;

import com.nick1est.proconnectx.dao.CategoryType;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;


@EqualsAndHashCode(callSuper = true)
@Data
public class FreelancerRegistrationRequest extends BaseRegistrationRequest {
    private List<CategoryType> categories;
    @NotEmpty
    private String description;
}
