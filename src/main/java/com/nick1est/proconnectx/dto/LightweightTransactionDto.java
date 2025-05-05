package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.TransactionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LightweightTransactionDto {
    @NotNull
    private Long id;
    @NotNull
    private TransactionStatus status;
}
