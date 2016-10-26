package com.oracle.cloud.demo.oe.tests;

import java.util.List;

import javax.ejb.Local;

import com.oracle.cloud.demo.oe.entities.Customer;
import com.oracle.cloud.demo.oe.entities.Order;

@Local
public interface TestProxyLocal {
    public Customer testGetCustomerByEmail(String email);
    public List<Order> testGetOrdersByCustomerEmail(String customerEmail);
    
}
