package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.Principal;
import com.nick1est.proconnectx.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;

    @Transactional(propagation = Propagation.MANDATORY)
    public void initClient(Principal principal) {
        Client client = new Client();
        client.setPrincipal(principal);
        clientRepository.save(client);
    }

    public Client getReferenceById(Long id) {
        return clientRepository.getReferenceById(id);
    }
}
