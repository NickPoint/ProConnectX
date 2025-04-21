package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Employer;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Review;
import com.nick1est.proconnectx.dto.ReviewDto;
import com.nick1est.proconnectx.dto.ReviewerDto;
import lombok.val;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class ReviewMapper {

    @Mapping(target = "reviewer",
            expression = "java(toReviewerDto(review.getClient(), review.getFreelancer(), review.getEmployer()))")
    public abstract ReviewDto toDto(Review review);

    public ReviewerDto toReviewerDto(Client client, Freelancer freelancer, Employer employer) {
        if (client != null) {
            return clientToDto(client);
        } else if (freelancer != null) {
            return freelancerToDto(freelancer);
        } else if (employer != null) {
            val reviewer = new ReviewerDto();
            reviewer.setId(employer.getId());
            reviewer.setFirstName(employer.getCompanyName());
            reviewer.setRating(employer.getRating());
            reviewer.setAvatarUrl(employer.getAvatarUrl());
            reviewer.setType(ReviewerDto.ReviewerType.Employer);
        }
        return null;
    }

    @Mapping(target = "type", expression = "java(ReviewerDto.ReviewerType.Client)")
    public abstract ReviewerDto clientToDto(Client client);
    @Mapping(target = "type", expression = "java(ReviewerDto.ReviewerType.Freelancer)")
    public abstract ReviewerDto freelancerToDto(Freelancer freelancer);
}
