package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.StatisticsType;
import com.nick1est.proconnectx.dto.StatsOverviewDto;
import com.nick1est.proconnectx.service.StatisticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Map;

@RestController
@Tag(name = "Statistics")
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping("/overview")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Map<StatisticsType, StatsOverviewDto.StatisticsDto>> getStatsOverview(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                                                                @RequestParam Instant start,
                                                                                                @RequestParam Instant end,
                                                                                                @RequestParam String zoneId) {
        return ResponseEntity.ok(statisticsService.getStatsForRole(userDetails, start, end, ZoneId.of(zoneId)));
    }
}