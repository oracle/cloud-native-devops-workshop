package com.oracle.cloud.demo.oe.entities;

import java.io.Serializable;

//Test update by venkata.ravipati@oracle.com1
//Test another comment by venky
//Test: add a new test comment by Cosmin - demo for Aorta
//Test comment by flavius

public class Address implements Serializable {
    private static final long serialVersionUID = 1L;
    private String streetAddress;
    private String city;
    private String stateProvince;
    private String postalCode;
    private String country;

    public Address() {
    }

    public Address(String streetAddress, String postalCode, String city, String stateProvince, String country) {
        this.streetAddress = streetAddress;
        this.postalCode = postalCode;
        this.city = city;
        this.stateProvince = stateProvince;
        this.country = country;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateProvince() {
        return stateProvince;
    }

    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Object[] getObjects() {
        return new Object[] {streetAddress, postalCode, city, stateProvince, country};
    }
}
