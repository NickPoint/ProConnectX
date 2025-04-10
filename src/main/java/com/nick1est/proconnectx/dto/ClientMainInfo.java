package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ClientMainInfo {
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotEmpty
    private String avatarUrl;

}
