package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailChannelService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    @Value("${app.base-url}")
    private String baseUrl;
    @Value("${spring.mail.username}")
    private String from;

    public void sendWelcomeEmail(String to, String displayName) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/welcome", ctx);
        sendHtml(to, "Welcome to ProConnectX!", html);
    }

    public void sendRegistrationRequestReceived(String to, String displayName) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/registrationRequestReceived", ctx);
        sendHtml(to, "Your registration request", html);
    }

    public void sendProfileVerified(String to, String displayName) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/verified", ctx);
        sendHtml(to, "Your registration request", html);
    }

    public void sendProfileRejected(String to, String displayName, String reason) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("baseUrl", baseUrl);
        ctx.setVariable("reason", reason);

        String html = templateEngine.process("emails/rejected", ctx);
        sendHtml(to, "Your registration request", html);
    }

    public void sendOrderCompletedEmail(String to, String name, Long orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", name);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("order-completed", ctx);
        sendHtml(to, "Your Order #" + orderId + " Is Complete", html);
    }

    private void sendHtml(String to, String subject, String htmlBody) {
        log.debug("Sending email to {}, subject: {}", to, subject);
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new MailSendException("Failed to send email to " + to, e);
        }
    }
}