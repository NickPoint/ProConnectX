package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.OwnerType;

public interface FileAccessStrategy {
    OwnerType ownerType();

    /**
     * Returns true if the given userDetailsImpl is allowed to access
     * the file, given its owning entity (e.g. order or profile).
     */
    boolean canAccess(File file, UserDetailsImpl userDetails);
}
