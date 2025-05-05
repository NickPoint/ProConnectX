package com.nick1est.proconnectx.dto;

import com.nick1est.proconnectx.dao.StatisticsType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class StatsOverviewDto {
    @NotNull
    private Map<StatisticsType, StatisticsDto> stats;

    @Data
    @Builder
    public static class StatisticsDto {
        @NotNull
        private BigDecimal value;
        private String trend;
        private BigDecimal percentGrow;
        List<BigDecimal> data;
    }
}
