package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.repository.FreelancerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FreelancerService {
    private final FreelancerRepository freelancerRepository;

    @Autowired
    public FreelancerService(FreelancerRepository freelancerRepository) {
        this.freelancerRepository = freelancerRepository;
    }
}
