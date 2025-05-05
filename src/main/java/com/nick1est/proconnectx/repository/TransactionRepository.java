package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Transaction;
import com.nick1est.proconnectx.dto.DailyEarningsDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
        SELECT MONTH(t.updatedAt) AS month, SUM(t.amount)
        FROM Transaction t
        WHERE t.status = 'RELEASED'
          AND t.order.service.freelancer.id = :freelancerId
          AND YEAR(t.updatedAt) = :year
        GROUP BY MONTH(t.updatedAt)
        ORDER BY MONTH(t.updatedAt)
    """)
    List<Object[]> findMonthlyEarningsForFreelancer(@Param("freelancerId") Long freelancerId, @Param("year") int year);

    @Query("""
            SELECT new com.nick1est.proconnectx.dto.DailyEarningsDto(
                FUNCTION('DATE_TRUNC', 'day', t.updatedAt),
                SUM(t.amount)
            )
            FROM Transaction t
            WHERE t.order.service.freelancer.id = :freelancerId
            AND t.status = 'RELEASED'
            AND t.updatedAt BETWEEN :start AND :end
            GROUP BY FUNCTION('DATE_TRUNC', 'day', t.updatedAt)
            ORDER BY FUNCTION('DATE_TRUNC', 'day', t.updatedAt)
            """)
    List<DailyEarningsDto> getDailyEarningsForFreelancer(
        @Param("freelancerId") Long freelancerId,
        @Param("start") Instant start,
        @Param("end") Instant end
    );
}
