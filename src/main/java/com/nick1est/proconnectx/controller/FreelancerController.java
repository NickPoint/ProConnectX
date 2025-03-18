package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.Freelancer;
import com.nick1est.proconnectx.dto.FreelancerFilter;
import com.nick1est.proconnectx.dto.FreelancerFilterResponse;
import com.nick1est.proconnectx.service.FreelancerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/freelancer")
public class FreelancerController {

    private final FreelancerService freelancerService;

    @Autowired
    public FreelancerController(FreelancerService freelancerService) {
        this.freelancerService = freelancerService;
    }

    @PostMapping("/filter")
    @ResponseStatus(HttpStatus.OK)
    public List<FreelancerFilterResponse> getFilteredFreelancers(
            @RequestBody FreelancerFilter freelancerFilter) {
        return freelancerService.findFilteredFreelancers(freelancerFilter);
    }

    @GetMapping("/profile/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Freelancer getFreelancerProfile(@PathVariable Long id) {
        return freelancerService.findById(id);
    }
}
