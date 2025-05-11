package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.OwnerType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ClientProfileFileStrategy implements FileAccessStrategy {
    private final Map<OwnerType, FileOwnerStrategy> fileOwnerStrategyStrategies;

    @Override public OwnerType ownerType() { return OwnerType.CLIENT; }

    @Override
    public boolean canAccess(File file, UserDetailsImpl user) {
        return file.getOwnerType() == ownerType()
                && file.getOwner().getId().equals(user.getActiveProfile().getId());
    }
}

