package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.FreelancerFilter;
import com.nick1est.proconnectx.dto.FreelancerFilterResponse;
import com.nick1est.proconnectx.mapper.FreelancerMapper;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FreelancerService {
    private final FreelancerRepository freelancerRepository;
    private final RoleRepository roleRepository;
    private final FreelancerMapper freelancerMapper;

    public List<FreelancerFilterResponse> findFilteredFreelancers(FreelancerFilter filter) {
        log.info("Finding filtered freelancers: {}", filter);
        val categories = freelancerMapper.mapECategoriesToCategories(filter.getCategories());
        val role = roleRepository.findByName(ERole.ROLE_FREELANCER)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));

        log.debug("Categories: {}", categories);

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

    public Freelancer findById(Long id) {
        return freelancerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Freelancer not found"));
    }

    public Freelancer save(Freelancer freelancer) {
        return freelancerRepository.save(freelancer);
    }

    public void deleteById(Long id) {
        freelancerRepository.deleteById(id);
    }

}
