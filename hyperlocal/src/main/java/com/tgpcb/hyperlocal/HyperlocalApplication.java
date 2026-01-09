package com.tgpcb.hyperlocal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HyperlocalApplication {

	public static void main(String[] args) {
		SpringApplication.run(HyperlocalApplication.class, args);
	}

}
