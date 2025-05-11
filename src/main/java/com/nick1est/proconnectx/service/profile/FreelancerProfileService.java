package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dao.User;
import com.nick1est.proconnectx.dto.profile.FreelancerProfileDto;
import com.nick1est.proconnectx.dto.profile.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.FreelancerMapperGeneric;
import com.nick1est.proconnectx.mapper.profile.GenericProfileMapper;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.service.FileService;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service("FREELANCER")
@Slf4j
public class FreelancerProfileService
        extends AbstractProfileService<
        Freelancer,
        FreelancerRegistrationRequest,
        FreelancerProfileDto
        > {

    private final FreelancerRepository repo;
    private final FreelancerMapperGeneric mapper;

    public FreelancerProfileService(
            FileService fileService,
            ApplicationEventPublisher events,
            FreelancerRepository repo,
            FreelancerMapperGeneric mapper
    ) {
        super(fileService, events);
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    protected JpaRepository<Freelancer, Long> getRepository() {
        return repo;
    }

    @Override
    protected GenericProfileMapper<Freelancer, FreelancerRegistrationRequest, FreelancerProfileDto> getMapper() {
        return mapper;
    }

    @Override
    protected Freelancer createEmptyProfile(User user) {
        var p = new Freelancer();
        p.setUser(user);
        user.getFreelancers().add(p);
        return p;
    }

    @Override
    protected Freelancer getProfileByUser(UserDetailsImpl ud) {
        val freelancerProfileId = ud.getActiveProfile().getId();
        return getProfileById(freelancerProfileId);
    }

    @Override
    protected Freelancer getProfileById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("error.freelancer.not_found", id));
    }
}
