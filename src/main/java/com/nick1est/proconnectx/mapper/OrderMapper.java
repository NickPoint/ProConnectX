package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Review;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.dto.ReviewDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ServiceMapper.class})
public interface OrderMapper {
    public OrderDto toDto(Order order);
    List<OrderDto> toDto(List<Order> orders);
}
