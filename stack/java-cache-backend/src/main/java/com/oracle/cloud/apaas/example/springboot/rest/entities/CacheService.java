package com.oracle.cloud.apaas.example.springboot.rest.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

/**
 * 
 * @author pnagy
 * Service to enable cache
 *
 */
@Component
public class CacheService {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	static final String CUSTOMER_CACHE = "customer";
	static final String LOCATION_CACHE = "location";

	private static final String PORT = Optional.ofNullable(System.getenv("PORT")).orElse("8080");
	private static final String CACHE_HOST = Optional.ofNullable(System.getenv("CACHING_INTERNAL_CACHE_URL"))
			.orElse("TestCache-acc");
	private static WebTarget target;
	private static Gson gson;

	/**
	 * Init cache REST client
	 */
	public CacheService() {
		logger.info("CACHING_INTERNAL_CACHE_URL=" + CACHE_HOST);

		String cacheURL = "http://" + CACHE_HOST + ":" + PORT + "/ccs";
		logger.info("Cache URL: " + cacheURL);

		target = ClientBuilder.newClient().target(cacheURL);
		logger.info("WebTarget created: " + target.getUri());
		
		gson = new Gson();

	}

	/**
	 * Store String object in cache
	 * @param cache Name of the cache
	 * @param key Key of the object to store and retreive
	 * @param value Object value to store
	 */
	private void putEntity(String cache, String key, Object value) {
		logger.info("Put key/object: " + key + "/" + value.toString() + " into cache: " + cache);
		Response putResponse = target.path(cache + "/" + key).request(MediaType.APPLICATION_OCTET_STREAM)
				.put(Entity.entity(value instanceof String ? value : (gson.toJson(value)), MediaType.TEXT_PLAIN));
		logger.info("Put response status: " + putResponse.getStatus());
	}

	/**
	 * Retrieve String object from cache
	 * @param cache Name of the cache
	 * @param key Key of the object to retrieve
	 * @return Object from cache
	 */
	private Object getEntity(String cache, String key) {
		Object result;
		logger.info("Get value for key: " + key + " from cache: " + cache);
		Response getResponse = target.path(cache + "/" + key).request(MediaType.APPLICATION_OCTET_STREAM)
				.get();

		logger.info("Get response status: " + getResponse.getStatus());
		
		String jsonResult = getResponse.readEntity(String.class);
		if (cache.equals(CUSTOMER_CACHE)) {
			result = gson.fromJson(jsonResult, Customer.class);
		} else {
			result = gson.fromJson(jsonResult, Location.class);
		}
		return result;
	}
	
	/**
	 * Get the size of the cache
	 * @param cache Name of the cache
	 * @return size of the cache
	 */
	private long getCacheSize(String cache) {
		logger.info("Get size of: " + cache + " cache.");
		Response getMetricsResponse = target.path(cache).request().get();

		logger.info("Get response status: " + getMetricsResponse.getStatus());
		
		String jsonStringMetrics = getMetricsResponse.readEntity(String.class); 
		
		logger.info(cache + " metrics: " + jsonStringMetrics);
		
		JsonObject jsonMetrics = gson.fromJson(jsonStringMetrics, JsonObject.class);
		
		return jsonMetrics.get("count").getAsLong();
	}

	/**
	 * Get Customer from cache
	 * @param key Key to identify customer
	 * @return Customer
	 */
	public Customer getCustomer(String key) {
		Customer customer = (Customer)getEntity(CUSTOMER_CACHE, key);
		customer.setAddress((Location)getEntity(LOCATION_CACHE, customer.getLocationid()));
		return customer;
	}

	/**
	 * Insert Customer into cache
	 * @param key Key to identify customer
	 * @param customer Customer to store
	 */
	public void insertCustomer(String key, Customer customer) {
		customer.setAddress(null);
		putEntity(CUSTOMER_CACHE, key, customer);
	}
	
	/**
	 * Insert Customer as JSON into cache
	 * @param key Key to identify customer
	 * @param jsonCustomer Customer as JSON formatted String
	 */
	public void insertCustomer(String key, String jsonCustomer) {
		putEntity(CUSTOMER_CACHE, key, jsonCustomer);
	}

	/**
	 * List all Customers in cache
	 * @return Customer list
	 */
	public List<Customer> getAllCustomer() {
		List<Customer> customers = new ArrayList<Customer>();

		long cacheSize = getCacheSize(CUSTOMER_CACHE);
		for (int i = 1; i <= cacheSize; i++) {
			Customer customer = (Customer)getEntity(CUSTOMER_CACHE, "cus-1" + String.format("%02d", i));
			if (customer != null) {
				customer.setAddress((Location)getEntity(LOCATION_CACHE, customer.getLocationid()));
				customers.add(customer);
			} else {
				break;
			}
		}

		return customers;
	}

	/**
	 * Get Loaction from cache
	 * @param key Key to identify location
	 * @return Location
	 */
	public Location getLocation(String key) {
		return (Location)getEntity(LOCATION_CACHE, key);
	}

	/**
	 * Store Location in cache
	 * @param key Key to identify location
	 * @param location Location to store
	 */
	public void insertLocation(String key, Location location) {
		putEntity(LOCATION_CACHE, key, location);
	}
	
	/**
	 * Store Location in cache as JSON formatted String
	 * @param key Key to identify location
	 * @param jsonLocation Location as JSON formatted String
	 */
	public void insertLocation(String key, String jsonLocation) {
		putEntity(LOCATION_CACHE, key, jsonLocation);
	}

	/**
	 * List all Location in cache
	 * @return Location list
	 */
	public List<Location> getAllLocation() {
		List<Location> locations = new ArrayList<Location>();

		long cacheSize = getCacheSize(CUSTOMER_CACHE);
		for (int i = 0; i < cacheSize; i++) {
			Location location = (Location)getEntity(LOCATION_CACHE, "loc-" + i);
			if (location != null) {
				locations.add(location);
			} else {
				break;
			}
		}
		return locations;
	}

}
