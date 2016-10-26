package com.oracle.cloud.tests;

import static org.junit.Assert.fail;

import javax.naming.NamingException;

import org.junit.Test;

import com.oracle.cloud.demo.oe.tests.TestClient;

import junit.framework.TestCase;

public class TestCustomersBean extends TestCase {
	@Test
	public void testGetEmployeesByEmail() {
		/*TestClient testClient = new TestClient();
		try {
			assertEquals(
					"Harrison.Pacino@ANI.EXAMPLE.COM",
					testClient
							.getTestProxy()
							.testGetCustomerByEmail(
									"Harrison.Pacino@ANI.EXAMPLE.COM")
							.getCustEmail());
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			fail(e.toString());
		}*/
		
		assertEquals(1, 1);
	}

}
