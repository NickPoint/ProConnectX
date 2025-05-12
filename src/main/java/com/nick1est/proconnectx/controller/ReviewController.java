package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dto.PostReviewDto;
import com.nick1est.proconnectx.dto.ReviewDto;
import com.nick1est.proconnectx.service.ReviewService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/review")
@Tag(name = "Review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<Page<ReviewDto>> getServiceReviews(@PathVariable Long serviceId,
                                                             @ParameterObject Pageable pageable) {
        return ResponseEntity.ok().body(reviewService.getServiceReviews(serviceId, pageable));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<Page<ReviewDto>> getClientReviews(@PathVariable Long clientId,
                                                            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok().body(reviewService.getClientReviews(clientId, pageable));
    }

    @PostMapping("/{orderId}/service")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> postServiceReview(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                  @PathVariable Long orderId,
                                                  @Valid @RequestBody PostReviewDto postReviewDto) {
        reviewService.postServiceReview(postReviewDto, orderId, userDetails.getActiveProfile().getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{orderId}/client")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Void> postClientReview(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                 @PathVariable Long orderId,
                                                 @Valid @RequestBody PostReviewDto postReviewDto) {
        reviewService.postClientReview(postReviewDto, orderId, userDetails.getActiveProfile().getId());
        return ResponseEntity.ok().build();
    }
}
