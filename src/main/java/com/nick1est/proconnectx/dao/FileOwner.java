package com.nick1est.proconnectx.dao;

import java.util.List;

public interface FileOwner {
    Long getId();
    OwnerType getOwnerType();
    List<File> getFiles();
}
