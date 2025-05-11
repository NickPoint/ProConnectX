package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.dao.Client;
import com.nick1est.proconnectx.dao.File;
import com.nick1est.proconnectx.dao.FileOwner;
import com.nick1est.proconnectx.dao.OwnerType;
import org.springframework.stereotype.Component;

@Component
public class ClientOwnerStrategy implements FileOwnerStrategy {
    @Override public OwnerType ownerType() { return OwnerType.CLIENT; }

    @Override public void applyOwner(File file, FileOwner owner) {
        file.setClient((Client) owner);
    }
}