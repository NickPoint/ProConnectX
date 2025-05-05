package com.nick1est.proconnectx.config;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.InitBinder;

@ControllerAdvice
public class GlobalBinderConfig {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

//    @Bean
//    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> cookieCustomizer() {
//        return factory -> factory.addContextCustomizers(context -> {
//            Rfc6265CookieProcessor processor = new Rfc6265CookieProcessor();
//            processor.setSameSiteCookies("None");
//            context.setCookieProcessor(processor);
//        });
//    }
}
