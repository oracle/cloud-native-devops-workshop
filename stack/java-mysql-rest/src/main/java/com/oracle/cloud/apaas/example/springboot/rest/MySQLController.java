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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.cloud.apaas.example.springboot.rest.entities.Customer;
import com.oracle.cloud.apaas.example.springboot.rest.entities.CustomerDAO;
import com.oracle.cloud.apaas.example.springboot.rest.entities.Location;
import com.oracle.cloud.apaas.example.springboot.rest.entities.LocationDAO;

@Controller
public class MySQLController {
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private CustomerDAO customerDao;

	@Autowired
	private LocationDAO locationDao;

	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/customers/{customerId}", method = RequestMethod.GET)
	@ResponseBody
	public Customer customers(@PathVariable(value = "customerId") String customerId) {
		return customerDao.findOne(customerId);
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/customers", method = RequestMethod.GET)
	@ResponseBody
	public String customers() {
		String result = null;

		List<Customer> customers = (List<Customer>) customerDao.findAll();

		ObjectMapper mapper = new ObjectMapper();
		try {
			result = mapper.writeValueAsString(customers);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return "{\"count\":" + customers.size() + ",\"result\": " + result + "}";
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/locations/{locationId}", method = RequestMethod.GET)
	@ResponseBody
	public Location location(@PathVariable(value = "locationId") String locationId) {
		return locationDao.findOne(locationId);
	}

	@CrossOrigin(origins = "*")
	@RequestMapping(value = "/locations", method = RequestMethod.GET)
	@ResponseBody
	public String locations() {
		String result = null;

		List<Location> locations = (List<Location>) locationDao.findAll();

		ObjectMapper mapper = new ObjectMapper();
		try {
			result = mapper.writeValueAsString(locations);
		} catch (JsonProcessingException e) {
			logger.error("Mapping Location entities to JSON format failed.", e);
		}

		return "{\"count\":" + locations.size() + ",\"result\": " + result + "}";
	}

	@GetMapping("/mysql")
	public String mysql(Map<String, Object> model) {
		return "mysql";
	}

	@GetMapping("/")
	public String environment(Map<String, Object> model) {
		return "environment";
	}
	
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
	
	private String getLog(String logFolder) {
		StringBuffer sb = new StringBuffer();
		
		File folder = new File(logFolder);
		File[] listOfFiles = folder.listFiles();

		for (int i = 0; i < listOfFiles.length; i++) {
			if (listOfFiles[i].isFile() && listOfFiles[i].getName().endsWith(".log") ) {
				sb.append(listOfFiles[i].getName().toUpperCase() + "==================================================================================\n");
				try (BufferedReader br = new BufferedReader(new FileReader(listOfFiles[i].getAbsolutePath()))) {
					String sCurrentLine;
					while ((sCurrentLine = br.readLine()) != null) {
						sb.append(sCurrentLine + "\n");
					}
				} catch (Exception e) {
					sb.append("EXCEPTION: " + e.getMessage());
					e.printStackTrace();
				} return sb.toString();
				
			}
		}
		return sb.toString();

	}
	

}
