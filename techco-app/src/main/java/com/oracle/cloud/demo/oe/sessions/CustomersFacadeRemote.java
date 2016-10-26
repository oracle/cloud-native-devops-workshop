package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.Customer;

import javax.ejb.Remote;

@Remote
public interface CustomersFacadeRemote extends AbstractFacadeRemote<Customer> {

	void setFilterByEmail(String email);

	String getFilterByEmail();

	Customer getCustomerByEmail(String email);
}
