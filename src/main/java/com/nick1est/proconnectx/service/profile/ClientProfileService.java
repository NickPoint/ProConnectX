package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.User;
import com.nick1est.proconnectx.dto.profile.ClientProfileDto;
import com.nick1est.proconnectx.dto.profile.ClientRegistrationRequest;
import com.nick1est.proconnectx.exception.NotFoundException;
import com.nick1est.proconnectx.mapper.ClientMapperGeneric;
import com.nick1est.proconnectx.mapper.profile.GenericProfileMapper;
import com.nick1est.proconnectx.repository.ClientRepository;
import com.nick1est.proconnectx.service.FileService;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service("CLIENT")
@Slf4j
public class ClientProfileService
        extends AbstractProfileService<
        Client,
        ClientRegistrationRequest,
        ClientProfileDto
        > {

    private final ClientRepository repo;
    private final ClientMapperGeneric mapper;

    public ClientProfileService(
            FileService fileService,
            ApplicationEventPublisher events,
            ClientRepository repo,
            ClientMapperGeneric mapper
    ) {
        super(fileService, events);
        this.repo = repo;
        this.mapper = mapper;
    }

    @Override
    protected JpaRepository<Client, Long> getRepository() {
        return repo;
    }

    @Override
    protected GenericProfileMapper<Client, ClientRegistrationRequest, ClientProfileDto> getMapper() {
        return mapper;
    }

    @Override
    protected Client createEmptyProfile(User user) {
        var p = new Client();
        p.setUser(user);
        user.getClients().add(p);
        return p;
    }

    @Override
    protected Client getProfileByUser(UserDetailsImpl ud) {
        val clientProfileId = ud.getActiveProfile().getId();
        return getProfileById(clientProfileId);
    }

    @Override
    protected Client getProfileById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("error.client.not_found", id));
    }
}
