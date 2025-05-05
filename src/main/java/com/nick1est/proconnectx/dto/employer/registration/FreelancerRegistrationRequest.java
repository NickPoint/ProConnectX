package com.nick1est.proconnectx.dto.employer.registration;

import com.nick1est.proconnectx.dao.CategoryType;
import com.nick1est.proconnectx.dto.AddressDto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Data
public class FreelancerRegistrationRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotNull
    private AddressDto address;
    @NotBlank
    private String phoneNumber;
    @NotEmpty
    private List<CategoryType> categories;
    private MultipartFile avatarImage;
    @NotEmpty
    private String description;
    @NotEmpty
    private List<MultipartFile> idDocument;
}
