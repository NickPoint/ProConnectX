package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;

    public Client getReferenceById(Long id) {
        return clientRepository.getReferenceById(id);
    }
}
