package com.oracle.cloud.apaas.example.springboot.rest.entities;

import org.springframework.stereotype.Component;

/**
 * @author pnagy
 *
 */
@Component
public class Customer {

	private String id;
	private String username;
	private String firstName;
	private String lastName;
	private String mobile;
	private String home;
	private String email;
	private String locationid;
	private Location address;

	public Customer() {
	}

	public Customer(String id, String username, String firstName, String lastName, Location location, String mobile,
			String home, String email) {
		super();
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.address = location;
		this.locationid = location.getId();
		this.mobile = mobile;
		this.home = home;
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getHome() {
		return home;
	}

	public void setHome(String home) {
		this.home = home;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getId() {
		return id;
	}

	public Location getaddress() {
		return address;
	}

	public void setAddress(Location address) {
		this.address = address;
	}
	
	public String getLocationid() {
		return locationid;
	}

	public void setLocationid(String locationId) {
		this.locationid = locationId;
	}
	
	public String getFormattedAddress() {
		return (getaddress() == null? "Address is not defined." : getaddress().getFormattedAddress());
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();

		sb.append(getId()).append(", ");
		sb.append(getFirstName()).append(" ").append(getLastName()).append(", ");
		sb.append(getUsername()).append(", ");
		sb.append(getEmail()).append(", ");
		sb.append(getMobile()).append(", ");
		sb.append(getHome()).append(", ");
		sb.append((getaddress() == null? "Address is not defined." : getaddress().getFormattedAddress()));

		return sb.toString();
	}

}
