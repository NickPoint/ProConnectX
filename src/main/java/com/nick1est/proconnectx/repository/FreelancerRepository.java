package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {

}
