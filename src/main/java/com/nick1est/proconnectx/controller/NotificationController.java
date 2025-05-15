package com.nick1est.proconnectx.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationController {
    @MessageMapping("/sendMessage")
    @SendTo("/topic/notifications")
        public String sendMessage(String message) {
        return message;
    }
}
