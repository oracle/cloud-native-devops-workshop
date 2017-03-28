package com.oracle.cloud.apaas.example.springboot.rest;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.oracle.cloud.apaas.example.springboot.rest.entities.CacheService;

@SpringBootApplication(scanBasePackages = { "com.oracle.cloud.apaas.example.springboot" })
public class Application extends SpringBootServletInitializer {

	private static Logger logger = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

		CacheService cacheService = context.getBean(CacheService.class);
		
		// load Customer data from customerData.json resource file
		try (FileReader fr = new FileReader(new File(System.getenv("APP_HOME") + "/customerData.json"))) {

			JsonParser jsonParser = new JsonParser();

			JsonArray jsonArray = (JsonArray) jsonParser.parse(fr);

			for (Object object : jsonArray) {
				JsonObject jsonObject = (JsonObject) object;

				cacheService.insertCustomer(jsonObject.get("id").getAsString(), jsonObject.toString());
			}

			logger.info(jsonArray.size() + " customer loaded into cache.");

			fr.close();
		} catch (IOException e) {
			logger.error("Can not load Customer data into cache", e);
		}

		// load Location data from locationData.json resource file
		try (FileReader fr = new FileReader(new File(System.getenv("APP_HOME") + "/locationData.json"))) {

			JsonParser jsonParser = new JsonParser();

			JsonArray jsonArray = (JsonArray) jsonParser.parse(fr);

			for (Object object : jsonArray) {
				JsonObject jsonObject = (JsonObject) object;

				cacheService.insertLocation(jsonObject.get("id").getAsString(), jsonObject.toString());
			}
			logger.info(jsonArray.size() + " location loaded into cache.");

			fr.close();
		} catch (IOException e) {
			logger.error("Can not load Location data into cache", e);
		}

	}

}
