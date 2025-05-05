package com.nick1est.proconnectx.dao;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Client extends AbstractUser {
    @OneToMany(mappedBy = "clientId", cascade = CascadeType.PERSIST)
    protected List<File> files;
}
