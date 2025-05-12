package com.nick1est.proconnectx;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@EnableAsync
public class ProConnectXApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProConnectXApplication.class, args);
    }

}
