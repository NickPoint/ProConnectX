package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.FreelancerDto;
import com.nick1est.proconnectx.dto.employer.registration.FreelancerRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.UserProfileUpdateDto;
import com.nick1est.proconnectx.events.FreelancerRegisteredEvent;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.CategoryMapper;
import com.nick1est.proconnectx.mapper.FreelancerMapper;
import com.nick1est.proconnectx.repository.FreelancerRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FreelancerService implements AbstractUserInterface<Freelancer> {
    @Value("${app.server.url}")
    private String serverUrl;

    private final FreelancerRepository freelancerRepository;
    private final FreelancerMapper freelancerMapper;
    private final FileService fileService;
    private final CategoryMapper categoryMapper;
    private final RoleRepository roleRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional
    public FreelancerDto registerFreelancer(FreelancerRegistrationRequest registrationRequest,
                                            UserDetailsImpl userDetails) {
        log.info("Registering new freelancer for principal: {}", userDetails.getId());
        val freelancer = getById(userDetails.getFreelancer().getId());
        freelancerMapper.updateFreelancerFromRegistrationRequest(registrationRequest, freelancer);
        val files = new ArrayList<File>();
        val avatar = fileService.uploadFile(freelancer, registrationRequest.getAvatarImage(),
                DocumentType.AVATAR, OwnerType.FREELANCER, true);
        files.add(avatar);
        val documents = fileService.uploadFiles(freelancer, registrationRequest.getIdDocument(),
                DocumentType.ID_CARD, OwnerType.FREELANCER, false);
        files.addAll(documents);
        freelancer.setFiles(files);
        freelancer.setAccountStatus(AccountStatus.PENDING);
        log.debug("New freelancer account has been registered: {}", freelancer.getId());
        applicationEventPublisher.publishEvent(new FreelancerRegisteredEvent(freelancer.getId(), freelancer.getFullName(), getAvatarUrl(freelancer)));
        return freelancerMapper.toDto(freelancer);
    }

//    public List<FreelancerFilterResponse> findFilteredFreelancers(FreelancerFilter filter) {
//        log.info("Finding filtered freelancers: {}", filter);
//        val categories = categoryMapper.toDaoList(filter.getCategories());
//        val role = roleRepository.findByName(RoleType.ROLE_FREELANCER)
//                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
//
//        val filteredFreelancers = freelancerRepository.findByNameAndFieldAndLocationAndRating(
//                filter.getFirstName(),
//                filter.getLastName(),
//                categories,
//                filter.getCountry(),
//                filter.getCity(),
//                filter.getRating());
//
//        log.debug("Filtered freelancers: {}", filteredFreelancers);
//
//        return freelancerMapper.mapFreelancersToFreelancerFilterResponses(filteredFreelancers);
//    }

    public FreelancerDto getDtoById(Long id) {
        val freelancer = getById(id);
        return freelancerMapper.toDto(freelancer);
    }

    @Override
    public void initUser(Principal principal) {
        log.debug("Init freelancer account for principal: {}", principal.getId());
        val freelancer = new Freelancer();
        freelancer.setPrincipal(principal);
        freelancerRepository.save(freelancer);
    }

    @Override
    public Freelancer getById(Long id) {
        return freelancerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("error.service.not_found", id));
    }

    @Override
    public Freelancer getReferenceById(Long id) {
        return freelancerRepository.getReferenceById(id);
    }

    @Override
    public List<Freelancer> getByAccountStatus(AccountStatus accountStatus) {
        if (accountStatus != null) {
            return freelancerRepository.findByAccountStatus(accountStatus);
        } else {
            return freelancerRepository.findAll();
        }
    }

    @Override
    public String getAvatarUrl(Freelancer freelancer) {
        return freelancer.getFiles().stream()
                .filter(file -> DocumentType.AVATAR.equals(file.getDocumentType()))
                .findFirst()
                .map(file -> serverUrl + "files/" + file.getId())
                .orElse(null);
    }

    @Transactional
    public void updateProfile(Long freelancerId, UserProfileUpdateDto userProfileUpdateDto) {
        freelancerMapper.updateFreelancerFromProfileUpdate(userProfileUpdateDto, getById(freelancerId));
    }
}
