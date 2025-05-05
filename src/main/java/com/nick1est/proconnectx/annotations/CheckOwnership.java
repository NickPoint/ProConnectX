package com.nick1est.proconnectx.annotations;

import com.nick1est.proconnectx.dao.OwnershipType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckOwnership {
    OwnershipType type();
}
