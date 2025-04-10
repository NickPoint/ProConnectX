package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.annotations.CheckOrderOwner;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.MessageResponse;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    @CheckOrderOwner
    public ResponseEntity<OrderDto> getOrder(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                             @PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/book/{serviceId}")
    @PreAuthorize("hasRole('ROLE_CLIENT') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> bookService(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long serviceId, @RequestBody String additionalNotes) {
        orderService.bookService(serviceId, userDetails.getClient(), additionalNotes);
        return ResponseEntity.ok(MessageResponse.builder().message("Freelancer has received your order and will contact you!").build());
    }
}
