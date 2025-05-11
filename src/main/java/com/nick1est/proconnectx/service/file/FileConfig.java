package com.nick1est.proconnectx.service.file;

import com.nick1est.proconnectx.dao.OwnerType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class FileConfig {
    @Bean
    public Map<OwnerType, FileAccessStrategy> fileAccessStrategies(
            List<FileAccessStrategy> strategies) {

        return strategies.stream()
                .collect(Collectors.toMap(
                        FileAccessStrategy::ownerType,
                        Function.identity()
                ));
    }
    @Bean
    public Map<OwnerType, FileOwnerStrategy> fileOwnerStrategies(
            List<FileOwnerStrategy> strategies) {

        return strategies.stream()
                .collect(Collectors.toMap(
                        FileOwnerStrategy::ownerType,
                        Function.identity()
                ));
    }
}
