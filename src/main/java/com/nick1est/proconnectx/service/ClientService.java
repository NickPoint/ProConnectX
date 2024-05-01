package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.FreelancerFilter;
import com.nick1est.proconnectx.repository.ClientRepository;
import com.nick1est.proconnectx.repository.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ClientService {
    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository, RoleRepository roleRepository) {
        this.clientRepository = clientRepository;
        this.roleRepository = roleRepository;
    }

    public List<Client> findFilteredFreelancers(FreelancerFilter filter) {
        log.info("Finding filtered offers: {}", filter);
        val role = roleRepository.findByName(ERole.ROLE_FREELANCER)
                .orElseThrow(() -> new EntityNotFoundException("Role not found"));
        return clientRepository.findByFieldAndLocationAndRatingAndRoles(
                filter.getCategories(),
                filter.getLocation(),
                filter.getRating(),
                role);
    }

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Client findById(Long id) {
        return clientRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Client not found"));
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public void deleteById(Long id) {
        clientRepository.deleteById(id);
    }

}
