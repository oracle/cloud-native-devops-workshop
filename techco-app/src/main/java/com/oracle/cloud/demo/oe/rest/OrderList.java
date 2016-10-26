package com.oracle.cloud.demo.oe.rest;

import com.oracle.cloud.demo.oe.entities.Order;
import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class OrderList {

    private List<Order> orders;

    public OrderList() {
    }

    public OrderList(List<Order> orders) {
        this.orders = orders;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

}
