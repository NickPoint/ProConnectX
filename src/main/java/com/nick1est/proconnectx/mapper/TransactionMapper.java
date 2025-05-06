package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Transaction;
import com.nick1est.proconnectx.dto.LightweightTransactionDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    LightweightTransactionDto toDto(Transaction transaction);
}
