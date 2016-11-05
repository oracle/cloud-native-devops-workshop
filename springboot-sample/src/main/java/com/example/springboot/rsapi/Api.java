package com.example.springboot.rsapi;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletContext;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.springframework.stereotype.Component;

@Component
@Path("/")
public class Api {
	@Context ServletContext context;

	@GET @Path("/message")
	@Produces("application/json")
	public Map<String, String> getMessage(@DefaultValue("Default server message.") @QueryParam("message") String message) {
		HashMap<String, String> result = new HashMap<>();
		result.put("message", message);

		return result;
	}

	@GET @Path("/hostname")
	@Produces("application/json")
	public Map<String, String> getHostname() throws UnknownHostException {
		HashMap<String, String> result = new HashMap<>();

		result.put("hostname", InetAddress.getLocalHost().getHostName());
		result.put("ip", InetAddress.getLocalHost().getHostAddress());

		return result;
	}

	@GET @Path("/randomsum")
	@Produces("application/json")
	public Map<String, Integer> calcRandomIntArray(@DefaultValue("128") @QueryParam("index") int index) {
		HashMap<String, Integer> result = new HashMap<>();

		int size = 1048576;

		int[] integers = new int[size];

		Random random = new Random();

		for (int i=0; i<size; i++) {
			integers[i] = random.nextInt();
		}

		int sum = 0;
		for (int i=0; i<size; i++) {
			sum += integers[i];
		}

		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			// do nothing
		}

		result.put("size", size);
		result.put("sum", sum);
		result.put("intAtIndex", integers[index]);

		return result;
	}

	@GET @Path("/quote")
	@Produces("application/json")
	public Map<String, Object> callQuote(@DefaultValue("ORCL") @QueryParam("symbol") String symbol) {
		HashMap<String, Object> result = new HashMap<>();

		// https://jersey.java.net/apidocs/latest/jersey/javax/ws/rs/client/Client.html
		Client client = ClientBuilder.newBuilder()
								.register(JacksonJsonProvider.class)
								.build();

		Map<String, Object> quote = client.target("http://dev.markitondemand.com/MODApis/Api/v2/Quote/json")
				.queryParam("symbol", symbol)
                .request()
                .accept(MediaType.APPLICATION_JSON_TYPE)
                .get(new GenericType<Map<String, Object>>() {});

		result.putAll(quote);

		Map<String, Object> serverNetwork = client.target("http://localhost:8080"+context.getContextPath()+"/api/hostname")
				.request()
				.accept(MediaType.APPLICATION_JSON_TYPE)
				.get(new GenericType<Map<String, Object>>() {});

		result.put("serverNetwork", serverNetwork);

		return result;
	}
}
