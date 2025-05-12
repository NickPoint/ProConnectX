package com.nick1est.proconnectx.dao;

import java.math.BigDecimal;
import java.math.RoundingMode;

public interface Rating {
    BigDecimal getRating();
    BigDecimal getRatingSum();
    Long getRatingCount();
}
