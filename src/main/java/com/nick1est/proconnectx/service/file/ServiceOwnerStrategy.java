package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.dao.*;
import org.springframework.stereotype.Component;


@Component
public class ServiceOwnerStrategy implements FileOwnerStrategy {
    @Override public OwnerType ownerType() { return OwnerType.SERVICE; }

    @Override public void applyOwner(File file, FileOwner owner) {
        file.setService((Service) owner);
    }
}
