package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dto.OrderDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ServiceMapper.class, ClientMapper.class, EventMapper.class, TransactionMapper.class})
public interface OrderMapper {
    OrderDto toDto(Order order);
    List<OrderDto> toDto(List<Order> orders);
}
