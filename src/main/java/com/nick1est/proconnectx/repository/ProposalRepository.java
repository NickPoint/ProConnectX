package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Proposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    List<Proposal> findAllByFreelancerId(Long freelancerId);

}
