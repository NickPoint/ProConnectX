package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.OwnerType;
import org.springframework.stereotype.Component;

@Component
public class FreelancerProfileFileStrategy implements FileAccessStrategy {
    @Override public OwnerType ownerType() { return OwnerType.FREELANCER; }

    @Override
    public boolean canAccess(File file, UserDetailsImpl user) {
        return file.getOwnerType() == ownerType()
                && file.getOwner().getId().equals(user.getActiveProfile().getId());
    }
}

