package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.annotations.CheckOwnership;
import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dto.BookServiceDto;
import com.nick1est.proconnectx.dto.OrderDto;
import com.nick1est.proconnectx.dto.OrdersFilter;
import com.nick1est.proconnectx.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Tag(name = "Order")
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;


    @GetMapping
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<Page<OrderDto>> getOrders(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                    @ParameterObject OrdersFilter filter,
                                                    @ParameterObject Pageable pageable) {
        val userOrders = orderService.getUserOrders(userDetails, filter, pageable);
        return ResponseEntity.ok(userOrders);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = ResourceType.ORDER)
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long orderId,
                                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        OrderDto order = orderService.getDtoById(orderId);
        return ResponseEntity.ok(order);
    }

    @Operation(summary = "Book a service", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                    schema = @Schema(implementation = BookServiceDto.class))))
    @PostMapping(value="/book/{serviceId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Long> bookService(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                            @PathVariable Long serviceId,
                                            @Valid @ModelAttribute BookServiceDto bookingInfo) {
        log.info("Booking request received for service {}, username: {}", serviceId, userDetails.getUsername());
        val orderId = orderService.bookService(serviceId, userDetails.getActiveProfile().getId(), bookingInfo);
        return ResponseEntity.ok().body(orderId);
    }

    @PutMapping("/{orderId}/accept")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = ResourceType.ORDER)
    public void acceptOrder(@PathVariable Long orderId, @AuthenticationPrincipal UserDetailsImpl userDetails,
                            @RequestParam LocalDate deadlineDate) {
        log.info("Freelancer accept request for order {}, username: {}", orderId, userDetails.getUsername());
        orderService.acceptOrder(orderId, userDetails.getActiveProfile(), deadlineDate);
    }

    @PutMapping("/{orderId}/submit-for-review")
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = ResourceType.ORDER)
    public void submitOrderForReview(@PathVariable Long orderId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Freelancer submit order for review {}, username: {}", orderId, userDetails.getUsername());
        orderService.submitOrderForReview(orderId, userDetails.getActiveProfile());
    }

    @PutMapping("/{orderId}/approve")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    @CheckOwnership(type = ResourceType.ORDER)
    public void approveOrder(@PathVariable Long orderId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Client approve order {}, username: {}", orderId, userDetails.getUsername());
        orderService.approveOrder(orderId, userDetails.getActiveProfile());
    }

    @PutMapping("/{orderId}/dispute")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    @CheckOwnership(type = ResourceType.ORDER)
    public void disputeOrder(@PathVariable Long orderId,
                             @NotEmpty @RequestBody String reason,
                             @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Client {} dispute order {}", userDetails.getUsername(), orderId);
        orderService.disputeOrder(orderId, reason, userDetails.getActiveProfile());
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    @CheckOwnership(type = ResourceType.ORDER)
    public void cancelOrder(@PathVariable Long orderId,
                            @RequestBody String reason,
                            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.debug("Client {} cancel order {}", userDetails.getUsername(), orderId);
        orderService.cancelOrder(orderId, reason, userDetails.getActiveProfile());
    }

// TODO: Make able while booking upload photo or ater order creation
// TODO: Rating logic
}
