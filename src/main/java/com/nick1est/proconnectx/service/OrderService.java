package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dao.OrderType;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.OrderMapper;
import com.nick1est.proconnectx.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ServiceService serviceService;
    private final ClientService clientService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final EventService eventService;
    private final ApplicationEventPublisher applicationEventPublisher;

    public OrderDto getOrderById(Long orderId) {
        val order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return orderMapper.toDto(order);
    }

    public List<Order> getOrdersByFreelancer(Freelancer freelancer) {
        return orderRepository.findByService_Freelancer(freelancer);
    }

    @Transactional
    public OrderDto bookService(Long serviceId,
                                Client client,
                                String additionalNotes) {
        val service = serviceService.getServiceReferenceById(serviceId);
        val order = new Order();
        order.setService(service);
        order.setClient(client);
        order.setType(OrderType.SERVICE);
        order.setAdditionalNotes(additionalNotes);
        val savedOrder = orderRepository.save(order);
        eventService.recordOrderCreated(savedOrder, client);
        return orderMapper.toDto(savedOrder);
    }
}
