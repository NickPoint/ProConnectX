package com.nick1est.proconnectx.aspect;

import com.nick1est.proconnectx.dao.Service;
import com.nick1est.proconnectx.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class VisitorCountAspect {

    private final ServiceRepository serviceRepository;

    @AfterReturning(pointcut = "execution(* com.nick1est.proconnectx.service.ServiceService.getServiceDtoById(..))",
            returning = "service")
    @Transactional
    public void incrementVisitorCount(Object service) {
        if (service instanceof Service serviceInstance) {
            log.debug("Incrementing visitor count for service {}", serviceInstance.getId());
            serviceInstance.incrementVisitorCounter();
        }
    }
}
