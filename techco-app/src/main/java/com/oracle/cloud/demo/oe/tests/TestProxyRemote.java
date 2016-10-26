package com.oracle.cloud.demo.oe.tests;

import java.util.List;

import javax.ejb.Remote;

import com.oracle.cloud.demo.oe.entities.Customer;
import com.oracle.cloud.demo.oe.entities.Order;

@Remote
public interface TestProxyRemote {
	
    public Customer testGetCustomerByEmail(String email);
    public List<Order> testGetOrdersByCustomerEmail(String customerEmail);
    
}
