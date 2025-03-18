package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Category;
import com.nick1est.proconnectx.dao.ServiceDao;
import com.nick1est.proconnectx.dto.ServiceCreateDto;
import com.nick1est.proconnectx.dto.ServiceFilter;
import com.nick1est.proconnectx.dto.ServiceFilterResponse;
import com.nick1est.proconnectx.mapper.ServiceMapper;
import com.nick1est.proconnectx.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;
    private final FreelancerService freelancerService;

    public ServiceDao createService(ServiceCreateDto serviceDto) {
        log.info("Creating service: {}", serviceDto);
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        val service = serviceMapper.serviceCreateDtoToService(serviceDto);
        val freelancer = freelancerService.findById(userDetails.getId());
        service.setFreelancer(freelancer);
        service.setRating(0.0);
        service.setRatingCount(0);
        return serviceRepository.save(service);
    }

    public ServiceDao findById(Long id) {
        log.info("Finding service by id: {}", id);
        return serviceRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Service not found"));
    }

    public List<ServiceFilterResponse> findFilteredServices(ServiceFilter serviceFilter) {
        log.info("Finding filtered services: {}", serviceFilter);
        List<Category> categories = serviceMapper.mapECategoriesToCategories(serviceFilter.getCategories());

        val filteredServices = serviceRepository.findByTitleAndCategoryAndLocationAndRatingAndPrice(
                serviceFilter.getTitle(),
                categories,
                serviceFilter.getLocation(),
                serviceFilter.getRating(),
                serviceFilter.getMinBudget(),
                serviceFilter.getMaxBudget());

        return serviceMapper.servicesToServiceFilterResponses(filteredServices);
    }
}
