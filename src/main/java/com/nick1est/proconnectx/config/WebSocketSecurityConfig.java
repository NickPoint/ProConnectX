package com.nick1est.proconnectx.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;

//@Configuration
//public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {
//
//    @Override
//    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
//        messages
//                .simpDestMatchers("/app/**").authenticated()
//                .simpSubscribeDestMatchers("/user/queue/**").permitAll()
//                .anyMessage().denyAll();
//    }
//
//    @Override
//    protected boolean sameOriginDisabled() {
//        return true;
//    }
//}

