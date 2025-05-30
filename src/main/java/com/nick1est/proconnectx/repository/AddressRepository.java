package com.nick1est.proconnectx.repository;

import com.nick1est.proconnectx.dao.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource(exported = false)
public interface AddressRepository extends JpaRepository<Address, Long> {
}
