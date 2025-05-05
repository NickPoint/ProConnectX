package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.CategoryMapper;
import com.nick1est.proconnectx.mapper.ServiceMapper;
import com.nick1est.proconnectx.repository.ServiceRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
    public Long createService(ServiceCreateDto serviceDto,
                              List<WorkflowStep> workflow,
                              List<Faq> faqs,
                              Freelancer freelancer) {
        log.info("Freelancer {} posted a new service: {}", freelancer.getId(), serviceDto);
        val service = serviceMapper.toDao(serviceDto, workflow, faqs);
        service.setFreelancer(freelancer);
        val savedService = serviceRepository.save(service);
        val files = fileService.uploadFiles(savedService.getId(), serviceDto.getImages(),
                DocumentType.GALLERY, OwnerType.SERVICE, true);
        savedService.setGallery(files);
        return savedService.getId();
    }

    @Transactional
    public ServiceDto getServiceDtoById(Long id) {
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
    public Page<LightweightServiceDto> findFilteredServices(ServiceFilter serviceFilter, Pageable pageable) {
        log.info("Finding filtered services: {}", serviceFilter);
        List<Category> categories = categoryMapper.toDaoList(serviceFilter.getCategories());

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Service> query = cb.createQuery(Service.class);
        Root<Service> service = query.from(Service.class);

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
                    cb.and(
                            cb.greaterThan(service.get("ratingCount"), 5),
                            cb.greaterThanOrEqualTo(service.get("rating"), serviceFilter.getRating())
                    ),
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

        int pageNumber = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();
        int firstResult = pageNumber * pageSize;

        TypedQuery<Service> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult(firstResult);
        typedQuery.setMaxResults(pageSize);

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Service> countRoot = countQuery.from(Service.class);
        countQuery.select(cb.count(countRoot)).where(cb.and(predicates.toArray(new Predicate[0])));

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        List<Service> resultList = typedQuery.getResultList();
        List<LightweightServiceDto> dtoList = serviceMapper.toDtoList(resultList);

        return new PageImpl<>(dtoList, pageable, total);
    }


}
