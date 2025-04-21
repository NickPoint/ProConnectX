package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.FreelancerDto;
import com.nick1est.proconnectx.dto.FreelancerFilter;
import com.nick1est.proconnectx.dto.FreelancerFilterResponse;
import com.nick1est.proconnectx.dto.employer.registration.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.mapper.CategoryMapper;
import com.nick1est.proconnectx.mapper.FreelancerMapper;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FreelancerService {
    private final FreelancerRepository freelancerRepository;
    private final RoleRepository roleRepository;
    private final FreelancerMapper freelancerMapper;
    private final FileService fileService;
    private final OrderService orderService;
    private final CategoryMapper categoryMapper;

    @Transactional(propagation = Propagation.MANDATORY)
    public void initFreelancer(Principal principal) {
        Freelancer freelancer = new Freelancer();
        freelancer.setPrincipal(principal);
        freelancerRepository.save(freelancer);
    }

    public FreelancerDto createFreelancer(FreelancerRegistrationRequest registrationRequest,
                                          UserDetailsImpl userDetails) {
        log.info("Registering new freelancer account for principal: {}", userDetails.getId());
        val freelancer = freelancerMapper.toDao(registrationRequest);
        val savedFreelancer = freelancerRepository.save(freelancer);
        fileService.uploadFile(savedFreelancer.getId(), registrationRequest.getAvatarImage(), DocumentType.AVATAR, OwnerType.FREELANCER);
        log.debug("New freelancer account has been created: {}", savedFreelancer.getId());
        return freelancerMapper.toDto(savedFreelancer);
    }

    public List<FreelancerFilterResponse> findFilteredFreelancers(FreelancerFilter filter) {
        log.info("Finding filtered freelancers: {}", filter);
        val categories = categoryMapper.toDaoList(filter.getCategories());
        val role = roleRepository.findByName(RoleType.ROLE_FREELANCER)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        val filteredFreelancers = freelancerRepository.findByNameAndFieldAndLocationAndRating(
                filter.getFirstName(),
                filter.getLastName(),
                categories,
                filter.getCountry(),
                filter.getCity(),
                filter.getRating());

        log.debug("Filtered freelancers: {}", filteredFreelancers);

        return freelancerMapper.mapFreelancersToFreelancerFilterResponses(filteredFreelancers);
    }

    public List<Freelancer> findAll() {
        return freelancerRepository.findAll();
    }

    public FreelancerDto findById(Long id) {
        val freelancer = freelancerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Freelancer not found"));
        val frelancerOrders = orderService.getOrdersByFreelancer(freelancer);
        return freelancerMapper.toDto(freelancer);
    }

    public Freelancer save(Freelancer freelancer) {
        return freelancerRepository.save(freelancer);
    }

    public void deleteById(Long id) {
        freelancerRepository.deleteById(id);
    }

}
