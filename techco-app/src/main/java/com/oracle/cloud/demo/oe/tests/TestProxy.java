package com.oracle.cloud.demo.oe.tests;

import com.oracle.cloud.demo.oe.entities.Customer;
import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.sessions.CustomersFacadeRemote;
import com.oracle.cloud.demo.oe.sessions.OrdersFacadeRemote;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.util.List;

/**
 * Session Bean implementation class TestProxy
 */
@Stateless(mappedName = "ProxyForTests")
public class TestProxy implements TestProxyRemote, TestProxyLocal {
	@EJB
	CustomersFacadeRemote customers;
	@EJB
	OrdersFacadeRemote orders;

	public TestProxy() {
	}

	@Override
	public Customer testGetCustomerByEmail(String email) {
		return (Customer) customers.getCustomerByEmail(email);
	}

	@Override
	public List<Order> testGetOrdersByCustomerEmail(String customerEmail) {
		// TODO Auto-generated method stub
		return orders.getOrdersByCustomerEmail(customerEmail);
	}

}
