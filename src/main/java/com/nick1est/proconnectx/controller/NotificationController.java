package com.nick1est.proconnectx.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationController {
    @MessageMapping("/sendMessage") // Endpoint matching the JavaScript destination
    @SendTo("/topic/notifications") // Broadcast to subscribers of this topic
        public String sendMessage(String message) {
        System.out.println("Received message: " + message); // Debugging log
        return message; // Broadcast the message
    }
}
