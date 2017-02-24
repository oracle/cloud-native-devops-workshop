package com.oracle.cloud.apaas.example.springboot.rest.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "location")
public class Location {

	@Id
	private String id;
	@Column(name = "street1")
	private String street1;
	@Column(name = "street2")
	private String street2;
	@Column(name = "city")
	private String city;
	@Column(name = "state")
	private String state;
	@Column(name = "zip")
	private String zip;
	@Column(name = "country")
	private String country;
	@Column(name = "latitude")
	private String latitude;
	@Column(name = "longitude")
	private String longitude;
	//@OneToOne(mappedBy = "location")
	//private Customer customer;

	public Location() {
	}

	public Location(String id, String street1, String street2, String city, String state, String zip, String country,
			String latitude, String longitude) {
		super();
		this.id = id;
		this.street1 = street1;
		this.street2 = street2;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.country = country;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public String getId() {
		return id;
	}
	
	public String getFormattedAddress() {
		StringBuffer formattedAddress = new StringBuffer();

		formattedAddress.append(getStreet1());
		if (getStreet2() != null && getStreet2().length() != 0) {
			formattedAddress.append(" ").append(getStreet2());
		}
		formattedAddress.append("\n");
		formattedAddress.append(getCity());
		formattedAddress.append(", ");
		formattedAddress.append(getState());
		formattedAddress.append(" ");
		formattedAddress.append(getZip());
		formattedAddress.append(" ");
		formattedAddress.append(getCountry());

		return formattedAddress.toString();
	}	

	/**
	 * @return the street1
	 */
	public String getStreet1() {
		return street1;
	}

	/**
	 * @param street1
	 *            the street1 to set
	 */
	public void setStreet1(String street1) {
		this.street1 = street1;
	}

	/**
	 * @return the street2
	 */
	public String getStreet2() {
		return street2;
	}

	/**
	 * @param street2
	 *            the street2 to set
	 */
	public void setStreet2(String street2) {
		this.street2 = street2;
	}

	/**
	 * @return the city
	 */
	public String getCity() {
		return city;
	}

	/**
	 * @param city
	 *            the city to set
	 */
	public void setCity(String city) {
		this.city = city;
	}

	/**
	 * @return the state
	 */
	public String getState() {
		return state;
	}

	/**
	 * @param state
	 *            the state to set
	 */
	public void setState(String state) {
		this.state = state;
	}

	/**
	 * @return the zip
	 */
	public String getZip() {
		return zip;
	}

	/**
	 * @param zip
	 *            the zip to set
	 */
	public void setZip(String zip) {
		this.zip = zip;
	}

	/**
	 * @return the country
	 */
	public String getCountry() {
		return country;
	}

	/**
	 * @param country
	 *            the country to set
	 */
	public void setCountry(String country) {
		this.country = country;
	}

	/**
	 * @return the latitude
	 */
	public String getLatitude() {
		return latitude;
	}

	/**
	 * @param latitude
	 *            the latitude to set
	 */
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	/**
	 * @return the longitude
	 */
	public String getLongitude() {
		return longitude;
	}

	/**
	 * @param longitude
	 *            the longitude to set
	 */
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	
}
