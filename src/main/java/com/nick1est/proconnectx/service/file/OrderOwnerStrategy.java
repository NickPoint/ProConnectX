package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.dao.*;
import org.springframework.stereotype.Component;


@Component
public class OrderOwnerStrategy implements FileOwnerStrategy {
    @Override public OwnerType ownerType() { return OwnerType.ORDER; }

    @Override public void applyOwner(File file, FileOwner owner) {
        file.setOrder((Order) owner);
    }
}
