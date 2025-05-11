/*
package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Employer;
import com.nick1est.proconnectx.dto.employer.registration.EmployerRegistrationRequest;
import com.nick1est.proconnectx.dto.employer.registration.EmployerResponseDto;
import com.nick1est.proconnectx.mapper.EmployerMapper;
import com.nick1est.proconnectx.repository.EmployerRepository;
import com.nick1est.proconnectx.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployerService {
    private final EmployerRepository employerRepository;
    private final EmployerMapper employerMapper;
    private final UserRepository principalRepository;

    public EmployerResponseDto getEmployerByPrincipal(UserDetailsImpl userDetails) {
        val user = principalRepository.getReferenceById(userDetails.getId());
        val employer = employerRepository.findByPrincipal(user)
                .orElseThrow(() -> new EntityNotFoundException("Employer not found"));
        return employerMapper.toDto(employer);
    }

    public List<Employer> findAll() {
        return employerRepository.findAll();
    }

    public Employer findById(Long id) {
        return employerRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Employer not found"));
    }

    public Employer createNewEmployer(EmployerRegistrationRequest employerRegistrationRequest) {
        val employer = employerMapper.toDao(employerRegistrationRequest);
        return employerRepository.save(employer);
    }

    public void deleteById(Long id) {
        employerRepository.deleteById(id);
    }

}
*/
