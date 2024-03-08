package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {


}
