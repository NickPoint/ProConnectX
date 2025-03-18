package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Bid;
import com.nick1est.proconnectx.dto.BidCardDto;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class BidMapper {
    public abstract List<BidCardDto> toBidCardDto(List<Bid> bid);
}
