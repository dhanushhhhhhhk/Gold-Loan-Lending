package com.starfinance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class StarFinanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(StarFinanceApplication.class, args);
    }
} 