package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.Order;
import com.nick1est.proconnectx.dto.FreelancerDto;
import com.nick1est.proconnectx.dto.FreelancerFilterResponse;
import com.nick1est.proconnectx.dto.employer.registration.FreelancerRegistrationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, OrderMapper.class})
public abstract class FreelancerMapper {
    public abstract FreelancerDto toDto(Freelancer freelancer);
    public abstract Freelancer toDao(FreelancerRegistrationRequest freelancerRegistrationRequest);
    public abstract List<FreelancerFilterResponse> mapFreelancersToFreelancerFilterResponses(List<Freelancer> freelancers);

}
