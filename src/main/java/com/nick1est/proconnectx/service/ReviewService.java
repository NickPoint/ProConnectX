package com.nick1est.proconnectx.service;


import com.nick1est.proconnectx.dao.Review;
import com.nick1est.proconnectx.dto.PostReviewDto;
import com.nick1est.proconnectx.dto.ReviewDto;
import com.nick1est.proconnectx.mapper.ReviewMapper;
import com.nick1est.proconnectx.repository.ClientRepository;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.repository.ReviewRepository;
import com.nick1est.proconnectx.repository.ServiceRepository;
import com.nick1est.proconnectx.service.profile.ClientProfileService;
import com.nick1est.proconnectx.service.profile.FreelancerProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewMapper reviewMapper;
    private final ReviewRepository reviewRepository;
    private final FreelancerRepository freelancerRepository;
    private final ClientRepository clientRepository;
    private final ServiceRepository serviceRepository;
    private final ClientProfileService clientProfileService;
    private final FreelancerProfileService freelancerProfileService;
    private final OrderService orderService;

    @Transactional
    public Page<ReviewDto> getServiceReviews(Long serviceId, Pageable pageable) {
        val reviews = reviewRepository.findAllByServiceId(serviceId, pageable);
        return reviews.map(reviewMapper::toDto);
    }

    @Transactional
    public Page<ReviewDto> getClientReviews(Long clientId, Pageable pageable) {
        val reviews = reviewRepository.findAllByClientId(clientId, pageable);
        return reviews.map(reviewMapper::toDto);
    }

    @Transactional
    public void postServiceReview(PostReviewDto dto, Long orderId, Long clientId) {
        log.info("Client {} left review, orderId: {}", clientId, orderId);
        val order = orderService.getById(orderId);
        val client = clientProfileService.getById(clientId);

        val review = new Review();
        review.setBody(dto.getBody());
        review.setRating(dto.getRating());
        review.setService(order.getService());
        review.setOrder(order);
        review.setClient(client);
        reviewRepository.save(review);

        serviceRepository.updateRating(order.getService().getId(), dto.getRating());
        serviceRepository.updateRatingAverage(order.getService().getId());

        freelancerRepository.updateRating(order.getService().getFreelancer().getId(), dto.getRating());
        freelancerRepository.updateRatingAverage(order.getService().getFreelancer().getId());
    }

    @Transactional
    public void postClientReview(PostReviewDto dto, Long orderId, Long freelancerId) {
        log.info("Freelancer {} left review, orderId: {}", freelancerId, orderId);
        val order = orderService.getById(orderId);
        val freelancer = freelancerProfileService.getById(freelancerId);

        Review review = new Review();
        review.setBody(dto.getBody());
        review.setRating(dto.getRating());
        review.setClient(order.getClient());
        review.setOrder(order);
        review.setFreelancer(freelancer);
        reviewRepository.save(review);

        clientRepository.updateRating(order.getClient().getId(), dto.getRating());
        clientRepository.updateRatingAverage(order.getClient().getId());
    }

}
