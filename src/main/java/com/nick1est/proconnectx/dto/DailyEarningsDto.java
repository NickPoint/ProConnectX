package com.nick1est.proconnectx.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;


public record DailyEarningsDto(Instant date, BigDecimal total) {
    public LocalDate getLocalDate(ZoneId zoneId) {
        return date.atZone(zoneId).toLocalDate();
    }
}
