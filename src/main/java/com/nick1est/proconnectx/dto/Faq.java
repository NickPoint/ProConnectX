package com.nick1est.proconnectx.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class Faq {
    @NotNull
    private String question;
    @NotNull
    private String answer;
}
