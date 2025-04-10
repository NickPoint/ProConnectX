package com.nick1est.proconnectx.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentDto {
    @NotNull
    private Long id;
    private ClientDto client;
    private EmployerMainInfo employer;
    private FreelancerDto freelancer;
    private String body;

}
