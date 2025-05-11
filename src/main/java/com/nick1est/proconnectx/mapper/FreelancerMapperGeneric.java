package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.ProfileType;
import com.nick1est.proconnectx.dto.LightweightRegistrationRequestDto;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.dto.profile.FreelancerProfileDto;
import com.nick1est.proconnectx.dto.profile.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.mapper.profile.GenericProfileMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", imports = ProfileType.class, uses = {CategoryMapper.class, OrderMapper.class, AddressMapper.class, FileMapper.class})
public interface FreelancerMapperGeneric extends GenericProfileMapper<Freelancer, FreelancerRegistrationRequest, FreelancerProfileDto> {
    @Mapping(target = "avatarImageUrl", source = "freelancer.files", qualifiedByName = "avatarImageMapper")
    @Mapping(target = "email", source = "user.email")
    FreelancerProfileDto toDto(Freelancer freelancer);

    @Mapping(target = "profileType", expression = "java(ProfileType.FREELANCER)")
    @Mapping(target = "email", source = "user.email")
    RegistrationRequestDto toRegistrationRequestDto(Freelancer freelancer);
    List<RegistrationRequestDto> toRegistrationRequestDto(List<Freelancer> freelancerProfiles);

    @Mapping(target = "profileType", expression = "java(ProfileType.FREELANCER)")
    @Mapping(target = "email", source = "user.email")
    LightweightRegistrationRequestDto toLightweightRegistrationRequestDto(Freelancer freelancer);
    List<LightweightRegistrationRequestDto> toLightweightRegistrationRequestDto(List<Freelancer> freelancerProfiles);;

//    public abstract List<FreelancerFilterResponse> mapFreelancersToFreelancerFilterResponses(List<Freelancer> freelancers);
}
