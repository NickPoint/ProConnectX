package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.ClientDto;
import com.nick1est.proconnectx.dto.employer.registration.ClientRegistrationRequest;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.ClientMapper;
import com.nick1est.proconnectx.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService implements AbstractUserInterface<Client> {
    @Value("${app.server.url}")
    private String serverUrl;

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final FileService fileService;

    @Transactional
    public ClientDto createClient(ClientRegistrationRequest registrationRequest, UserDetailsImpl userDetails) {
        log.info("Registering new client for principal: {}", userDetails.getId());
        val client = getById(userDetails.getClient().getId());
        clientMapper.updateClientFromDto(registrationRequest, client);
        val files = new ArrayList<File>();
        val avatar = fileService.uploadFile(client.getId(), registrationRequest.getAvatarImage(), DocumentType.AVATAR, OwnerType.CLIENT, true);
        files.add(avatar);
        val documents = fileService.uploadFiles(client.getId(), registrationRequest.getIdDocument(), DocumentType.ID_CARD, OwnerType.CLIENT, false);
        files.addAll(documents);
        client.setFiles(files);
        client.setAccountStatus(AccountStatus.PENDING);
        log.debug("New client account has been registered: {}", client.getId());
        return clientMapper.toDto(client);
    }

    public ClientDto getDtoById(Long id) {
        val client = getById(id);
        return clientMapper.toDto(client);
    }

    @Override
    public void initUser(Principal principal) {
        log.debug("Init client account for principal: {}", principal);
        val client = new Client();
        client.setPrincipal(principal);
        clientRepository.save(client);
    }

    @Override
    public Client getById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new NotFoundException("error.client.not_found", clientId));
    }

    @Override
    public Client getReferenceById(Long id) {
        return clientRepository.getReferenceById(id);
    }

    @Override
    public List<Client> getByAccountStatus(AccountStatus accountStatus) {
        if (accountStatus != null) {
            return clientRepository.findByAccountStatus(accountStatus);
        } else {
            return clientRepository.findAll();
        }
    }

    @Override
    public String getAvatarUrl(Client client) {
        return client.getFiles().stream()
                .filter(file -> DocumentType.AVATAR.equals(file.getDocumentType()))
                .findFirst()
                .map(file -> serverUrl + "/files/" + file.getId())
                .orElse(null);
    }
}
