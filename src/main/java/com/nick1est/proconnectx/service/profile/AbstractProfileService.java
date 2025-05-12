package com.nick1est.proconnectx.service.profile;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.*;
import com.nick1est.proconnectx.dto.profile.BaseProfileDto;
import com.nick1est.proconnectx.dto.profile.BaseRegistrationRequest;
import com.nick1est.proconnectx.dto.profile.UserProfileUpdateDto;
import com.nick1est.proconnectx.events.domain.ProfileCreatedEvent;
import com.nick1est.proconnectx.events.domain.ProfileInitiatedEvent;
import com.nick1est.proconnectx.mapper.profile.GenericProfileMapper;
import com.nick1est.proconnectx.service.FileService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
public abstract class AbstractProfileService<
        P extends BaseProfile,
        Req extends BaseRegistrationRequest,
        Dto extends BaseProfileDto> {
    protected final FileService fileService;
    protected final ApplicationEventPublisher events;

    @Value("${app.server.url}")
    private String serverUrl;

    @Transactional
    public void initProfile(User user) {
        P profile = createEmptyProfile(user);
        getRepository().save(profile);
        user.setLastActiveProfile(profile.getProfileType());

        events.publishEvent(new ProfileInitiatedEvent(profile.getId(), profile.getProfileType()));
    }

    @Transactional
    public Dto createProfile(Req request, UserDetailsImpl userDetails) {
        P profile = getProfileByUser(userDetails);

        // 2) map registration request
        getMapper().updateFromRegistration(request, profile);

        // 3) upload files
        List<File> allFiles = new ArrayList<>();
        allFiles.add(fileService.uploadSingle(profile, request.getAvatarImage(), DocumentType.AVATAR, true));
        allFiles.addAll(fileService.uploadFiles(profile, request.getIdDocument(), DocumentType.ID_CARD, false));
        profile.setFiles(allFiles);

        // 4) transition status
        profile.updateStatus(ProfileStatus.PENDING);

        // 5) notification
        events.publishEvent(new ProfileCreatedEvent(profile.getId(), profile.getProfileType()));

        // 6) return DTO
        return getMapper().toDto(profile);
    }

    @Transactional
    public void updateProfile(Long profileId, UserProfileUpdateDto updateDto) {
        P profile = getProfileById(profileId);
        getMapper().updateFromProfileUpdate(updateDto, profile);
    }

    @Transactional
    public void updateAvatar(Long profileId, MultipartFile avatarFile) {
        P profile = getProfileById(profileId);
        List<File> existingAvatars = profile.getFiles().stream()
                .filter(file -> DocumentType.AVATAR.equals(file.getDocumentType())).toList();

        for (File oldAvatar : existingAvatars) {
            fileService.deleteFileById(oldAvatar.getId());
        }

        fileService.uploadSingle(profile, avatarFile, DocumentType.AVATAR, true);
    }

    public Dto getDtoById(Long id) {
        return getMapper().toDto(getProfileById(id));
    }

    public P getById(Long id) {
       return getProfileById(id);
    }

    public String getAvatarUrl(Long id) {
        val profile = getProfileById(id);
        return profile.getFiles().stream()
                .filter(file -> DocumentType.AVATAR.equals(file.getDocumentType()))
                .findFirst()
                .map(file -> serverUrl + "/files/" + file.getId())
                .orElse(null);
    }

    protected abstract JpaRepository<P, Long> getRepository();

    protected abstract GenericProfileMapper<P, Req, Dto> getMapper();

    protected abstract P createEmptyProfile(User user);

    protected abstract P getProfileByUser(UserDetailsImpl ud);

    protected abstract P getProfileById(Long id);
}
