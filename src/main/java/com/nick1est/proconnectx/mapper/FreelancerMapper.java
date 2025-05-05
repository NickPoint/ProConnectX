package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.AccountType;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dto.FreelancerDto;
import com.nick1est.proconnectx.dto.LightWeightFreelancerDto;
import com.nick1est.proconnectx.dto.LightweightRegistrationRequestDto;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.dto.employer.registration.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.UserProfileUpdateDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", imports = AccountType.class, uses = {CategoryMapper.class, OrderMapper.class, AddressMapper.class, FileMapper.class})
public abstract class FreelancerMapper {
    @Mapping(target = "avatarImageUrl", source = "freelancer.files", qualifiedByName = "avatarImageMapper")
    @Mapping(target = "email", source = "principal.email")
    public abstract FreelancerDto toDto(Freelancer freelancer);
    @Mapping(target = "avatarImageUrl", source = "freelancer.files", qualifiedByName = "avatarImageMapper")
    @Mapping(target = "email", source = "principal.email")
    public abstract LightWeightFreelancerDto toLightweightDto(Freelancer freelancer);
    public abstract Freelancer toDao(FreelancerRegistrationRequest freelancerRegistrationRequest);

    @Mapping(target = "accountType", expression = "java(AccountType.FREELANCER)")
    @Mapping(target = "email", source = "principal.email")
    @Mapping(target = "avatarImageUrl", source = "freelancer.files", qualifiedByName = "avatarImageMapper")
    public abstract RegistrationRequestDto toRegistrationRequestDto(Freelancer freelancer);
    public abstract List<RegistrationRequestDto> toRegistrationRequestDto(List<Freelancer> freelancers);

    @Mapping(target = "accountType", expression = "java(AccountType.FREELANCER)")
    @Mapping(target = "email", source = "principal.email")
    public abstract LightweightRegistrationRequestDto toLightweightRegistrationRequestDto(Freelancer freelancer);
    public abstract List<LightweightRegistrationRequestDto> toLightweightRegistrationRequestDto(List<Freelancer> freelancers);

    public abstract void updateFreelancerFromRegistrationRequest(FreelancerRegistrationRequest dto, @MappingTarget Freelancer freelancer);
    public abstract void updateFreelancerFromProfileUpdate(UserProfileUpdateDto dto, @MappingTarget Freelancer freelancer);
//    public abstract List<FreelancerFilterResponse> mapFreelancersToFreelancerFilterResponses(List<Freelancer> freelancers);
}
