package com.oracle.cloud.demo.oe.tests;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import com.oracle.cloud.demo.oe.entities.Order;

public class TestClient {

	private static String URL = "t3://localhost:7001";
	private static String USER_NAME = "weblogic";
	private static String PASSWORD = "welcome1";
	private  List<Integer> ordersIdList = new ArrayList<Integer>();

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		/*try {
			System.out.println("Customer email:"
					+ getTestProxy().testGetCustomerByEmail(
							"Harrison.Pacino@ANI.EXAMPLE.COM").getCustEmail());
			
			
			
			List<Order> orders = getTestProxy().testGetOrdersByCustomerEmail(
					"Harrison.Pacino@ANI.EXAMPLE.COM");
			System.out.println("Orders from application:");
			for (Order order : orders) {
				System.out.println(order.getOrderId());
			}
			
			System.out.println("Orders from jdbc statement:");
			for (int i : getCustomerOrdersByEmail("Harrison.Pacino@ANI.EXAMPLE.COM")) {
				System.out.println(i);
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}*/

	}

	public InitialContext getInitialContext() throws NamingException {
		Hashtable<String, String> env = new Hashtable<String, String>();
		env.put(Context.INITIAL_CONTEXT_FACTORY,
				"weblogic.jndi.WLInitialContextFactory");
		env.put(Context.SECURITY_PRINCIPAL, USER_NAME);
		env.put(Context.SECURITY_CREDENTIALS, PASSWORD);
		env.put(Context.PROVIDER_URL, URL);
		return new InitialContext(env);

	}

	public TestProxyRemote getTestProxy() throws NamingException {
		return (TestProxyRemote) getInitialContext().lookup(
				"ProxyForTests#com.oracle.cloud.demo.oe.tests.TestProxyRemote");
	}

	public List<Integer> getCustomerOrdersByEmail(String email)
			throws ClassNotFoundException, SQLException {
		Class.forName("oracle.jdbc.driver.OracleDriver");
		// or you can use:
		// DriverManager.registerDriver(
		// new oracle.jdbc.driver.OracleDriver());
		Connection conn = DriverManager.getConnection(
				"jdbc:oracle:thin:@cloud-vm:1521:XE", "oe", "oe");

		Statement stmt = conn.createStatement();
		ResultSet rset = stmt
				.executeQuery("select oe.ORDER_ID from orders oe, customers cs where oe.CUSTOMER_ID=cs.customer_id and cs.CUST_EMAIL like '"
						+ email + "'");
		int i = 0;
		while (rset.next()) {
			getOrdersList().add(rset.getInt(1));
		}
		stmt.close();
		conn.close();
		return getOrdersList();

	}

	public List<Integer> getOrdersList() {
		return ordersIdList;
	}

	public void setOrdersList(List<Integer> ordersList) {
		this.ordersIdList = ordersList;
	}

}
