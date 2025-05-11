package com.nick1est.proconnectx.dto.profile;

import com.nick1est.proconnectx.dto.AddressDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Data
public class BaseRegistrationRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotNull
    private AddressDto address;
    @NotBlank
    private String phoneNumber;
    private MultipartFile avatarImage;
    @NotEmpty
    private List<MultipartFile> idDocuments;
}
