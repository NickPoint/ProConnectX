package com.nick1est.proconnectx.events;

import com.nick1est.proconnectx.dao.AbstractUser;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UserApprovedEvent extends ApplicationEvent {
    private final AbstractUser user;

    public UserApprovedEvent(Object source, AbstractUser user) {
        super(source);
        this.user = user;
    }
}