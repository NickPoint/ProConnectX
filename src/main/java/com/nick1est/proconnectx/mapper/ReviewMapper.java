package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Review;
import com.nick1est.proconnectx.dto.ReviewDto;
import com.nick1est.proconnectx.dto.ReviewerDto;
import lombok.val;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {FileMapper.class})
public abstract class ReviewMapper {

    @Mapping(target = "reviewer",
            expression = "java(toReviewerDto(review.getClient(), review.getFreelancer()))")
    public abstract ReviewDto toDto(Review review);

    public ReviewerDto toReviewerDto(Client client, Freelancer freelancer) {
        if (client != null) {
            return clientToDto(client);
        } else if (freelancer != null) {
            return freelancerToDto(freelancer);
        }
        return null;
    }

    @Mapping(target = "type", expression = "java(ReviewerDto.ReviewerType.Client)")
    @Mapping(target = "avatarImageUrl", source = "client.files", qualifiedByName = "avatarImageMapper")
    public abstract ReviewerDto clientToDto(Client client);

    @Mapping(target = "type", expression = "java(ReviewerDto.ReviewerType.Freelancer)")
    @Mapping(target = "avatarImageUrl", source = "freelancer.files", qualifiedByName = "avatarImageMapper")
    public abstract ReviewerDto freelancerToDto(Freelancer freelancer);
}
