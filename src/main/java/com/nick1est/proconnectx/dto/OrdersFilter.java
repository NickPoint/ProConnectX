package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.OrderStatus;
import lombok.Data;

import java.util.List;

@Data
public class OrdersFilter {
    private List<OrderStatus> statuses;
}
