package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource(exported = false)
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findAllByFreelancerId(Long freelancerId);

}
