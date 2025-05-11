package com.nick1est.proconnectx.events;

import com.nick1est.proconnectx.dao.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UserApprovedEvent extends ApplicationEvent {
    private final User user;

    public UserApprovedEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
}