package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.CategoryMapper;
import com.nick1est.proconnectx.mapper.ServiceMapper;
import com.nick1est.proconnectx.repository.ServiceRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
@Slf4j
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;
    private final CategoryMapper categoryMapper;
    private final EntityManager entityManager;
    private final FileService fileService;
    private final MessageSource messageSource;

    @Transactional
    public FullServiceDto createService(ServiceCreateDto serviceDto,
                                        List<WorkflowStep> workflow,
                                        List<Faq> faqs,
                                        Freelancer freelancer) {
        log.info("Freelancer {} posted a new service: {}", freelancer.getId(), serviceDto);
        val service = serviceMapper.toDao(serviceDto, workflow, faqs);
        service.setFreelancer(freelancer);
        val savedService = serviceRepository.save(service);
        fileService.uploadFiles(savedService.getId(), serviceDto.getImages(), DocumentType.GALLERY, OwnerType.SERVICE);
        return serviceMapper.toDto(service);
    }

    @Transactional
    public FullServiceDto getServiceDtoById(Long id) {
        val service = getServiceById(id);
        return serviceMapper.toDto(service);
    }

    public Service getServiceById(Long id) {
        log.info("Finding service by id: {}", id);
        return serviceRepository.findById(id).orElseThrow(() -> new NotFoundException("error.service.not_found", id));
    }

    public Service getServiceReferenceById(Long id) {
        return serviceRepository.getReferenceById(id);
    }

    @Transactional
    public List<LightweightServiceDto> findFilteredServices(ServiceFilter serviceFilter) {
        log.info("Finding filtered services: {}", serviceFilter);
        List<Category> categories = categoryMapper.toDaoList(serviceFilter.getCategories());

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Service> query = cb.createQuery(Service.class);
        Root<Service> service = query.from(Service.class);
        query.select(service).distinct(true);

        List<Predicate> predicates = new ArrayList<>();

        if (serviceFilter.getTitle() != null && !serviceFilter.getTitle().isEmpty()) {
            predicates.add(cb.like(cb.lower(service.get("title")), "%" + serviceFilter.getTitle().toLowerCase() + "%"));
        }

        if (categories != null && !categories.isEmpty()) {
            Join<Service, Category> categoryJoin = service.join("categories", JoinType.LEFT);
            predicates.add(categoryJoin.in(categories));
        }

        if (serviceFilter.getRating() != null) {
            predicates.add(cb.or(
                    cb.and(cb.greaterThan(service.get("ratingCount"), 5), cb.greaterThanOrEqualTo(service.get("rating"), serviceFilter.getRating())),
                    cb.lessThanOrEqualTo(service.get("ratingCount"), 5)
            ));
        }

        if (serviceFilter.getMinBudget() != null) {
            predicates.add(cb.greaterThanOrEqualTo(service.get("price"), serviceFilter.getMinBudget()));
        }

        if (serviceFilter.getMaxBudget() != null) {
            predicates.add(cb.lessThanOrEqualTo(service.get("price"), serviceFilter.getMaxBudget()));
        }

        query.where(cb.and(predicates.toArray(new Predicate[0])));

        val resultList = entityManager.createQuery(query).getResultList();
        return serviceMapper.toDtoList(resultList);
    }


}
