package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.entities.OrderItem;

import javax.ejb.Remote;
import java.util.List;

@Remote
public interface OrdersFacadeRemote extends AbstractFacadeRemote<Order> {

    void setFilterByCustomerEmail(String email);

    String getFilterByCustomerEmail();

    List<Order> getOrdersByCustomerEmail(String customerEmail);

    List<OrderItem> getItemsByCustomerEmailAndOrderId(String customerEmail, Integer orderId);
}
