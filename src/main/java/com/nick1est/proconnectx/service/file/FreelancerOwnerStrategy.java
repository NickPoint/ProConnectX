package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.dao.*;
import org.springframework.stereotype.Component;


@Component
public class FreelancerOwnerStrategy implements FileOwnerStrategy {
    @Override public OwnerType ownerType() { return OwnerType.FREELANCER; }

    @Override public void applyOwner(File file, FileOwner owner) {
        file.setFreelancer((Freelancer) owner);
    }
}
