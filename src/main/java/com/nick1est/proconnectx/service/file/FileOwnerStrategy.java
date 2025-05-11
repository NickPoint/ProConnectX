package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.FileOwner;
import com.nick1est.proconnectx.dao.OwnerType;

public interface FileOwnerStrategy {
    OwnerType ownerType();
    void applyOwner(File file, FileOwner owner);
}
