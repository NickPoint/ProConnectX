package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.AbstractUser;
import com.nick1est.proconnectx.dao.AccountStatus;
import com.nick1est.proconnectx.dao.AccountType;
import com.nick1est.proconnectx.dto.RegistrationRequestDto;
import com.nick1est.proconnectx.mapper.ClientMapper;
import com.nick1est.proconnectx.mapper.FreelancerMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminService {
    private final FreelancerService freelancerService;
    private final ClientService clientService;
    private final GeneralApprovalService generalApprovalService;
    private final FreelancerMapper freelancerMapper;
    private final ClientMapper clientMapper;

    public List<RegistrationRequestDto> getFreelancersRegistrationRequests(AccountStatus accountStatus) {
        val freelancers = freelancerService.getByAccountStatus(accountStatus);
        return freelancerMapper.toRegistrationRequestDto(freelancers);
    }

    public List<RegistrationRequestDto> getClientsRegistrationRequests(AccountStatus accountStatus) {
        val clients = clientService.getByAccountStatus(accountStatus);
        return clientMapper.toRegistrationRequestDto(clients);
    }

    @Transactional
    public void approveRegistrationRequest(AccountType entityType, Long id, UserDetailsImpl userDetails) {
        AbstractUser approvable = getApprovableEntity(entityType, id);
        generalApprovalService.approve(approvable, userDetails);
    }

    @Transactional
    public void rejectRegistrationRequest(AccountType entityType, Long id, String reason, UserDetailsImpl userDetails) {
        AbstractUser approvable = getApprovableEntity(entityType, id);
        generalApprovalService.reject(approvable, reason, userDetails);
    }

    private AbstractUser getApprovableEntity(AccountType type, Long id) {
        return switch (type) {
            case FREELANCER -> freelancerService.getById(id);
            case CLIENT -> clientService.getById(id);
            default -> throw new IllegalArgumentException("Unsupported approvable type: " + type);
        };
    }
}
