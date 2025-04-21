package com.nick1est.proconnectx.config;

import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CookieConfig {

//    @Bean
//    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> cookieCustomizer() {
//        return factory -> factory.addContextCustomizers(context -> {
//            Rfc6265CookieProcessor processor = new Rfc6265CookieProcessor();
//            processor.setSameSiteCookies("None");
//            context.setCookieProcessor(processor);
//        });
//    }
}
