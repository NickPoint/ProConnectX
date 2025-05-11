package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.auth.UserDetailsImpl;
import com.nick1est.proconnectx.dao.OrderStatus;
import com.nick1est.proconnectx.dao.StatisticsType;
import com.nick1est.proconnectx.dto.DailyEarningsDto;
import com.nick1est.proconnectx.dto.StatsOverviewDto;
import com.nick1est.proconnectx.repository.OrderRepository;
import com.nick1est.proconnectx.repository.TransactionRepository;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@EqualsAndHashCode
@Service
@Slf4j
@RequiredArgsConstructor
public class StatisticsService {

    private final TransactionRepository transactionRepository;
    private final OrderRepository orderRepository;

    public Map<StatisticsType, StatsOverviewDto.StatisticsDto>  getStatsForRole(UserDetailsImpl userDetails, Instant start, Instant end,
                                                                                ZoneId zoneId) {
        Map<StatisticsType, StatsOverviewDto.StatisticsDto> stats = new HashMap<>();

        switch (userDetails.getActiveProfile().getProfileType()) {
            case FREELANCER -> {
                val freelancerId = userDetails.getActiveProfile().getId();
                stats.put(StatisticsType.DAILY_TOTAL_EARNINGS, getFreelancerDailyEarnings(freelancerId, start, end, zoneId));
                stats.put(StatisticsType.ORDERS_COMPLETED, getFreelancerOrdersCompleted(freelancerId, start, end));
                stats.put(StatisticsType.ORDER_SUCCESS_RATE, getFreelancerSuccessRate(freelancerId));
                stats.put(StatisticsType.ACTIVE_ORDERS, getFreelancerActiveOrders(freelancerId));
//                stats.put(StatisticsType.PENDING_PAYMENTS, getFreelancerPendingPayments(freelancerId));
//                stats.put(StatisticsType.AVERAGE_RATING, getFreelancerAverageRating(freelancerId));
//                stats.put(StatisticsType.NEW_MESSAGES, getFreelancerUnreadMessages(freelancerId));
//                stats.put(StatisticsType.NEW_INVITATIONS, getFreelancerPendingInvitations(freelancerId));
//                stats.put(StatisticsType.WORK_HOURS_TRACKED, getFreelancerTrackedHours(freelancerId));
//                stats.put(StatisticsType.TOP_CATEGORIES, getFreelancerTopCategories(freelancerId));
            }
            case CLIENT -> {
                val clientId = userDetails.getActiveProfile().getId();
                stats.put(StatisticsType.TOTAL_SERVICES_PURCHASED, getTotalServicesPurchased(clientId, start, end));
            }
            case ADMIN -> {
                // similar...
            }
        }

        return stats;
    }

    public StatsOverviewDto.StatisticsDto getFreelancerDailyEarnings(Long freelancerId, Instant start, Instant end,
                                                                     ZoneId zoneId) {
        List<DailyEarningsDto> earnings = transactionRepository.getDailyEarningsForFreelancer(freelancerId, start, end);

        Map<LocalDate, BigDecimal> earningsMap = earnings.stream()
                .collect(Collectors.toMap(earning -> earning.getLocalDate(zoneId), DailyEarningsDto::total));

        List<BigDecimal> dailyValues = new ArrayList<>();
        List<LocalDate> dateList = new ArrayList<>();

        LocalDate currentDate = start.atZone(zoneId).toLocalDate();
        LocalDate endDate = end.atZone(zoneId).toLocalDate();
        while (!currentDate.isAfter(endDate)) {
            dateList.add(currentDate);
            dailyValues.add(earningsMap.getOrDefault(currentDate, BigDecimal.ZERO));
            currentDate = currentDate.plusDays(1);
        }

        BigDecimal previous = BigDecimal.ZERO;
        BigDecimal currentVal = BigDecimal.ZERO;

        int size = dailyValues.size();
        if (size >= 2) {
            previous = dailyValues.get(size - 2);
            currentVal = dailyValues.get(size - 1);
        }

        String trend;
        if (currentVal.compareTo(previous) > 0) {
            trend = "up";
        } else if (currentVal.compareTo(previous) < 0) {
            trend = "down";
        } else {
            trend = "neutral";
        }


        BigDecimal smoothingFactor = BigDecimal.valueOf(0.1);
        BigDecimal smoothedValue = previous.multiply(BigDecimal.ONE.subtract(smoothingFactor))
                .add(currentVal.multiply(smoothingFactor));

        BigDecimal percentGrowth = BigDecimal.ZERO;
        if (previous.compareTo(BigDecimal.ZERO) != 0) {
            percentGrowth = smoothedValue.subtract(previous)
                    .divide(previous, 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        BigDecimal total = dailyValues.stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        return StatsOverviewDto.StatisticsDto.builder()
                .value(total)
                .trend(trend)
                .percentGrow(percentGrowth)
                .data(dailyValues)
                .build();
    }

    public StatsOverviewDto.StatisticsDto getFreelancerOrdersCompleted(Long freelancerId, Instant start, Instant end) {
        long count = orderRepository.countByFreelancerIdAndStatusAndUpdatedAtBetween(freelancerId,
                OrderStatus.COMPLETED, start, end);
        return simpleStat(BigDecimal.valueOf(count));
    }

    public StatsOverviewDto.StatisticsDto getFreelancerSuccessRate(Long freelancerId) {
        long completed = orderRepository.countByFreelancerIdAndStatus(freelancerId, OrderStatus.COMPLETED);
        long canceled = orderRepository.countByFreelancerIdAndStatus(freelancerId, OrderStatus.CANCELED);
        long total = completed + canceled;
        BigDecimal rate = total == 0 ? BigDecimal.ZERO :
                BigDecimal.valueOf(completed * 100).divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
        return simpleStat(rate);
    }

    public StatsOverviewDto.StatisticsDto getFreelancerActiveOrders(Long freelancerId) {
        long count = orderRepository.countByFreelancerIdAndStatusIn(
                freelancerId, List.of(OrderStatus.IN_PROGRESS, OrderStatus.DISPUTED,
                        OrderStatus.SUBMITTED_FOR_REVIEW, OrderStatus.APPROVED));
        return simpleStat(BigDecimal.valueOf(count));
    }

    public StatsOverviewDto.StatisticsDto getTotalServicesPurchased(Long clientId, Instant start, Instant end) {
        long count = orderRepository.countByClientIdAndStatusAndUpdatedAtBetween(clientId, OrderStatus.COMPLETED, start, end);
        return simpleStat(BigDecimal.valueOf(count));
    }

    private StatsOverviewDto.StatisticsDto simpleStat(BigDecimal value) {
        return StatsOverviewDto.StatisticsDto.builder()
                .value(value)
                .build();
    }
}
