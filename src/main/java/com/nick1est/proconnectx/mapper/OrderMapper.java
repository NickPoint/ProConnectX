package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.Project;
import com.nick1est.proconnectx.dto.BidDto;
import com.nick1est.proconnectx.dto.BidRequest;
import com.nick1est.proconnectx.dto.OrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    public OrderDto toDto(Order order);
}
