package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.*;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.CategoryMapper;
import com.nick1est.proconnectx.mapper.ServiceMapper;
import com.nick1est.proconnectx.repository.ServiceRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

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
    public Page<LightweightServiceDto> getServices(ServiceFilter serviceFilter, Pageable pageable) {
        List<Category> categories = categoryMapper.toDaoList(serviceFilter.getCategories());
        Specification<Service> spec = ServiceSpecifications.buildSpecification(serviceFilter, categories);
        Page<Service> services = serviceRepository.findAll(spec, pageable);

        return services.map(serviceMapper::toLightDto);
    }

    @Transactional
    public Page<LightweightServiceDto> getUserServices(UserDetailsImpl userDetails, Pageable pageable) {
        Specification<Service> spec = ServiceSpecifications.filterByUser(userDetails);
        Page<Service> services = serviceRepository.findAll(spec, pageable);

        return services.map(serviceMapper::toLightDto);
    }

    public class ServiceSpecifications {

        public static Specification<Service> titleLike(String title) {
            return (root, query, cb) -> {
                if (title == null || title.isEmpty()) return null;
                return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
            };
        }

        public static Specification<Service> hasCategories(List<Category> categories) {
            return (root, query, cb) -> {
                if (categories == null || categories.isEmpty()) return null;
                query.distinct(true);
                Join<Service, Category> categoryJoin = root.join("categories", JoinType.LEFT);
                return categoryJoin.in(categories);
            };
        }

        public static Specification<Service> addressFilter(String partialAddress) {
            return (root, query, cb) -> {
                if (partialAddress == null || partialAddress.isEmpty()) return null;
                Join<Service, Address> addressJoin = root.join("address", JoinType.LEFT);

                Predicate streetPredicate = cb.like(cb.lower(addressJoin.get("street")), "%" + partialAddress.toLowerCase() + "%");
                Predicate cityPredicate = cb.like(cb.lower(addressJoin.get("city")), "%" + partialAddress.toLowerCase() + "%");
                Predicate regionPredicate = cb.like(cb.lower(addressJoin.get("region")), "%" + partialAddress.toLowerCase() + "%");
                Predicate countryPredicate = cb.like(cb.lower(addressJoin.get("country")), "%" + partialAddress.toLowerCase() + "%");
                Predicate houseNumberPredicate = cb.like(cb.lower(addressJoin.get("houseNumber")), "%" + partialAddress.toLowerCase() + "%");
                Predicate postalCodePredicate = cb.like(cb.lower(addressJoin.get("postalCode")), "%" + partialAddress.toLowerCase() + "%");


                return cb.or(streetPredicate, cityPredicate, regionPredicate, countryPredicate, houseNumberPredicate, postalCodePredicate);
            };
        }

        public static Specification<Service> ratingFilter(Double rating) {
            return (root, query, cb) -> {
                if (rating == null) return null;
                return cb.or(
                        cb.and(
                                cb.greaterThan(root.get("ratingCount"), 5),
                                cb.greaterThanOrEqualTo(root.get("rating"), rating)
                        ),
                        cb.lessThanOrEqualTo(root.get("ratingCount"), 5)
                );
            };
        }

        public static Specification<Service> minBudget(Double min) {
            return (root, query, cb) -> {
                if (min == null) return null;
                return cb.greaterThanOrEqualTo(root.get("price"), min);
            };
        }

        public static Specification<Service> maxBudget(Double max) {
            return (root, query, cb) -> {
                if (max == null) return null;
                return cb.lessThanOrEqualTo(root.get("price"), max);
            };
        }

        public static Specification<Service> filterByUser(UserDetailsImpl userDetails) {
            return (root, query, cb) -> {
                if (RoleType.ROLE_ADMIN.equals(userDetails.getActiveRole())) {
                    return cb.conjunction();
                } else if (RoleType.ROLE_FREELANCER.equals(userDetails.getActiveRole())) {
                    return cb.equal(root.get("freelancer"), userDetails.getFreelancer());
                } else {
                    return cb.disjunction();
                }
            };
        }

        public static Specification<Service> buildSpecification(ServiceFilter filter, List<Category> categories) {
            return Specification
                    .where(titleLike(filter.getTitle()))
                    .and(hasCategories(categories))
                    .and(ratingFilter(filter.getRating()))
                    .and(minBudget(filter.getMinBudget()))
                    .and(maxBudget(filter.getMaxBudget()))
                    .and(addressFilter(filter.getLocation()));
        }
    }
}
