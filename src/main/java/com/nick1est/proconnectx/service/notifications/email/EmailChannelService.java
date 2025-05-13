package com.nick1est.proconnectx.service.notifications.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
        sendHtml(to, "We received your registration request", html);
    }

    public void sendProfileVerified(String to, String displayName) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/verified", ctx);
        sendHtml(to, "Your profile is verified", html);
    }

    public void sendProfileRejected(String to, String displayName, String reason) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("baseUrl", baseUrl);
        ctx.setVariable("reason", reason);

        String html = templateEngine.process("emails/rejected", ctx);
        sendHtml(to, "Your registration request was declined", html);
    }

    public void sendNewOrderEmail(String to, String name, String clientName, String serviceName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", name);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);
        ctx.setVariable("clientName", clientName);
        ctx.setVariable("serviceName", serviceName);

        String html = templateEngine.process("emails/new-order", ctx);
        sendHtml(to, "New order", html);
    }

    public void sendOrderAcceptedEmail(String to, String displayName, String freelancerName, String serviceName, String orderId, String deadline) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("freelancerName", freelancerName);
        ctx.setVariable("serviceName", serviceName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("deadline", deadline);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/order-accepted", ctx);
        sendHtml(to, "Your order has been accepted", html);
    }

    public void sendOrderSubmittedForReviewEmail(String to, String displayName, String freelancerName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("freelancerName", freelancerName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/order-submitted-for-review", ctx);
        sendHtml(to, "Order submitted for your review", html);
    }

    public void sendOrderApprovedEmail(String to, String displayName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/order-approved", ctx);
        sendHtml(to, "Your order has been approved", html);
    }

    public void sendOrderCompletedEmail(String to, String displayName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/order-completed", ctx);
        sendHtml(to, "Order completed successfully", html);
    }

    public void sendOrderDisputedEmail(String to, String displayName, String orderId, String reason) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("reason", reason);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/order-disputed", ctx);
        sendHtml(to, "Order dispute raised", html);
    }

    public void sendOrderCanceledEmail(String to, String displayName, String orderId, String reason) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("reason", reason);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/order-canceled", ctx);
        sendHtml(to, "Order canceled", html);
    }

    public void sendDisputeSolutionProposedEmail(String to, String displayName, String orderId, String solution) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("solution", solution);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/dispute-solution-proposed", ctx);
        sendHtml(to, "Proposed solution for your dispute", html);
    }

    public void sendDisputeSolutionAcceptedEmail(String to, String displayName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/dispute-solution-accepted", ctx);
        sendHtml(to, "Dispute solution accepted", html);
    }

    public void sendDisputeSolutionAcceptedByAdminEmail(String to, String displayName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/dispute-solution-accepted-by-admin", ctx);
        sendHtml(to, "Admin accepted dispute solution", html);
    }

    public void sendDisputeSolutionRejectedEmail(String to, String displayName, String orderId, String reason) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("reason", reason);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/dispute-solution-rejected", ctx);
        sendHtml(to, "Dispute solution rejected", html);
    }

    public void sendDisputeSolutionRejectedByAdminEmail(String to, String displayName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/dispute-solution-rejected-by-admin", ctx);
        sendHtml(to, "Admin rejected dispute solution", html);
    }

    public void sendDisputeAdminNotifyEmail(String to, String displayName, String orderId) {
        Context ctx = new Context();
        ctx.setVariable("name", displayName);
        ctx.setVariable("orderId", orderId);
        ctx.setVariable("baseUrl", baseUrl);

        String html = templateEngine.process("emails/dispute-admin-notify", ctx);
        sendHtml(to, "New dispute requires admin attention", html);
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