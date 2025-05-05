package com.nick1est.proconnectx.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;


public record DailyEarningsDto(Instant date, BigDecimal total) {
    public LocalDate getLocalDate(ZoneId zoneId) {
        return date.atZone(zoneId).toLocalDate();
    }
}
