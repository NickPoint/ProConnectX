package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dto.FreelancerFilterResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class FreelancerMapper extends CommonMapper {

    public abstract List<FreelancerFilterResponse> mapFreelancersToFreelancerFilterResponses(List<Freelancer> freelancers);

}
