package com.ppr;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.ppr.infra")
public class PprApplication {
    public static void main(String[] args) {
        SpringApplication.run(PprApplication.class, args);
    }
}

