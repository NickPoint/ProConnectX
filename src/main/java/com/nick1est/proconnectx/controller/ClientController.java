package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dto.FreelancerFilter;
import com.nick1est.proconnectx.service.ClientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/client")
public class ClientController {

    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Client> getFilteredFreelancers(
            @RequestBody FreelancerFilter freelancerFilter) {
        return clientService.findFilteredFreelancers(freelancerFilter);
    }

    @GetMapping("/profile/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Client getClientProfile(@PathVariable Long id) {
        return clientService.findById(id);
    }
}
