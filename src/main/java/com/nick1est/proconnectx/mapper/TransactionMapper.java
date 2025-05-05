package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Transaction;
import com.nick1est.proconnectx.dto.LightweightTransactionDto;
import com.nick1est.proconnectx.dto.OrderDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    LightweightTransactionDto toDto(Transaction transaction);
}
