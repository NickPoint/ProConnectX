package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Review;
import com.nick1est.proconnectx.dto.ReviewDto;
import com.nick1est.proconnectx.dto.ReviewerDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {FileMapper.class})
public interface ReviewMapper {

    @Mapping(target = "reviewer",
            expression = "java(toReviewerDto(review))")
    ReviewDto toDto(Review review);

    default ReviewerDto toReviewerDto(Review review) {
        if (review.getService() != null) {
            return clientToDto(review.getClient());
        }
        if (review.getFreelancer() != null) {
            return freelancerToDto(review.getFreelancer());
        }
        return null;
    }

    @Mapping(target = "avatarImageUrl", source = "client.files", qualifiedByName = "avatarImageMapper")
    ReviewerDto clientToDto(Client client);

    @Mapping(target = "avatarImageUrl", source = "freelancer.files", qualifiedByName = "avatarImageMapper")
    ReviewerDto freelancerToDto(Freelancer freelancer);
}
