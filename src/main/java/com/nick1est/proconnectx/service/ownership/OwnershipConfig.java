package com.nick1est.proconnectx.service.ownership;

import com.nick1est.proconnectx.dao.ResourceType;
import com.nick1est.proconnectx.dao.RoleType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.util.Pair;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class OwnershipConfig {

    @Bean
    public Map<Pair<ResourceType, RoleType>, OwnershipStrategy> ownershipStrategies(
            List<OwnershipStrategy> strategies
    ) {
        return strategies.stream()
                .collect(Collectors.toMap(
                        s -> Pair.of(s.getResourceType(), s.getRoleType()),
                        Function.identity()
                ));
    }
}

