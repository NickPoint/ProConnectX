package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.annotations.CheckOwnership;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.OrderStatus;
import com.nick1est.proconnectx.dao.OrderType;
import com.nick1est.proconnectx.dao.OwnershipType;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Order")
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;


    @GetMapping
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDto>> getOrders(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        val userOrders = orderService.getUserOrders(userDetails, pageable);
        return ResponseEntity.ok(userOrders);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDto>> getActiveOrders(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        val userOrders = orderService.getActiveUserOrders(userDetails, pageable);
        return ResponseEntity.ok(userOrders);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = OwnershipType.ORDER)
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long orderId,
                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        OrderDto order = orderService.getDtoById(orderId);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/book/{serviceId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Long> bookService(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long serviceId,
                                            @RequestBody String additionalNotes) {
        val orderId = orderService.bookService(serviceId, userDetails.getClient(), additionalNotes);
        return ResponseEntity.ok().body(orderId);
    }

    @PutMapping("/{orderId}/accept")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = OwnershipType.ORDER)
    public void acceptOrder(@PathVariable Long orderId, @AuthenticationPrincipal UserDetailsImpl userDetails,
                            @RequestParam LocalDate deadlineDate) {
        orderService.acceptOrder(orderId, userDetails.getFreelancer(), deadlineDate);
    }

    @PutMapping("/{orderId}/submit-for-review")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = OwnershipType.ORDER)
    public void submitOrderForReview(@PathVariable Long orderId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        orderService.submitOrderForReview(orderId, userDetails.getFreelancer());
    }

    @PutMapping("/{orderId}/approve")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    @CheckOwnership(type = OwnershipType.ORDER)
    public void approveOrder(@PathVariable Long orderId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        orderService.approveOrder(orderId, userDetails);
    }

    @PutMapping("/{orderId}/dispute")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    @CheckOwnership(type = OwnershipType.ORDER)
    public void disputeOrder(@PathVariable Long orderId,
                             @NotEmpty @RequestBody String reason,
                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        orderService.disputeOrder(orderId, reason, userDetails.getClient());
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = OwnershipType.ORDER)
    public void cancelOrder(@PathVariable Long orderId,
                            @RequestBody String reason,
                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        orderService.cancelOrder(orderId, reason, userDetails);
    }
}
