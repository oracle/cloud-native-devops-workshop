package com.oracle.cloud.apaas.example.springboot.rest;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.cloud.apaas.example.springboot.rest.entities.CacheService;
import com.oracle.cloud.apaas.example.springboot.rest.entities.Customer;
import com.oracle.cloud.apaas.example.springboot.rest.entities.Location;

@Controller
public class CacheController {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private CacheService cache;

	// customer REST interface
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/customers/{customerId}", method = RequestMethod.GET)
	@ResponseBody
	public Customer customers(@PathVariable(value = "customerId") String customerId) {
		return cache.getCustomer(customerId);
	}

	// customers REST interface
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/customers", method = RequestMethod.GET)
	@ResponseBody
	public String customers() {
		String result = null;

		List<Customer> customers = cache.getAllCustomer();

		ObjectMapper mapper = new ObjectMapper();
		try {
			result = mapper.writeValueAsString(customers);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return "{\"count\":" + customers.size() + ",\"result\": " + result + "}";
	}

	//location REST interface
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/locations/{locationId}", method = RequestMethod.GET)
	@ResponseBody
	public Location location(@PathVariable(value = "locationId") String locationId) {
		return cache.getLocation(locationId);
	}

	// locations REST interface
	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/locations", method = RequestMethod.GET)
	@ResponseBody
	public String locations() {
		String result = null;

		List<Location> locations = cache.getAllLocation();

		ObjectMapper mapper = new ObjectMapper();
		try {
			result = mapper.writeValueAsString(locations);
		} catch (JsonProcessingException e) {
			logger.error("Mapping Location entities to JSON format failed.", e);
		}

		return "{\"count\":" + locations.size() + ",\"result\": " + result + "}";
	}

	// list customers for edit
	@RequestMapping(value = "/customerlist", method = RequestMethod.GET)
	public String showCustomerList(ModelMap model) {
		
		logger.info("showCustomerList");
		
		List<Customer> customers = cache.getAllCustomer();
		/*
		List<Customer> customers = new ArrayList<Customer>();
		Location location = new Location("loc-1", "Street1", "Street2", "city", "state", "zip", "country", "latitude", "longitude");
		Customer customer = new Customer("cus-101", "nagypeti", "Peter", "Nagy", location, "123456", "7890", "1@2");
		customer.setLocationid("loc-1");
		customers.add(customer);*/
		model.addAttribute("customers", customers);
		
		
		return "customerlist";
	}
	
	// show update form
	@RequestMapping(value = "/customers/{id}/update", method = RequestMethod.GET)
	public String showCustomerUpdateForm(@PathVariable("id") String id, Model model) {

		logger.info("showCustomerUpdateForm: " + id);

		Customer customer = cache.getCustomer(id);
		model.addAttribute("customer", customer);

		return "customerform";

	}
	
	// update customer
	@RequestMapping(value = "/customerlist", method = RequestMethod.POST)
	public String updateCustomer(@RequestParam(value="firstname") String firstname, @RequestParam(value="lastname") String lastname, 
			@RequestParam(value="customerid") String customerid) {

		logger.info("updateCustomer: " + firstname + " " + lastname +  ", id: " + customerid);

		Customer customer = cache.getCustomer(customerid);
		customer.setFirstName(firstname);
		customer.setLastName(lastname);
		
		cache.insertCustomer(customerid, customer);
		
		return "redirect:/customerlist";

	}

	// default page shows environment variables and links to list/edit page and REST endpoints
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String environment(Map<String, Object> model) {
		return "environment";
	}

	// print agentlog to browser
	@RequestMapping(value = "/agentlog", method = RequestMethod.GET, produces = "text/plain")
	@ResponseBody
	public String agentlog() {
		StringBuffer sb = new StringBuffer("AGENTLOG ");
		String logFolder = System.getenv("APP_HOME") + "/apmagent/logs/tomcat_instance";

		sb.append("(Location: ");
		sb.append(logFolder);
		sb.append("):\n");
		sb.append(getLog(logFolder));
		return sb.toString();
	}

	// print applog to browser
	@RequestMapping(value = "/applog", method = RequestMethod.GET, produces = "text/plain")
	@ResponseBody
	public String applog() {
		StringBuffer sb = new StringBuffer("APPLOG ");
		String logFolder = System.getenv("APP_HOME");

		sb.append("(Location: ");
		sb.append(logFolder);
		sb.append("):\n");
		sb.append(getLog(logFolder));
		return sb.toString();
	}

	// get applications log as String
	private String getLog(String logFolder) {
		StringBuffer sb = new StringBuffer();

		File folder = new File(logFolder);
		File[] listOfFiles = folder.listFiles();

		for (int i = 0; i < listOfFiles.length; i++) {
			if (listOfFiles[i].isFile() && listOfFiles[i].getName().endsWith(".log")) {
				sb.append(listOfFiles[i].getName().toUpperCase()
						+ "==================================================================================\n");
				try (BufferedReader br = new BufferedReader(new FileReader(listOfFiles[i].getAbsolutePath()))) {
					String sCurrentLine;
					while ((sCurrentLine = br.readLine()) != null) {
						sb.append(sCurrentLine + "\n");
					}
				} catch (Exception e) {
					sb.append("EXCEPTION: " + e.getMessage());
					e.printStackTrace();
				}
				return sb.toString();

			}
		}
		return sb.toString();

	}

}
