package com.oracle.cloud.demo.oe.rest;

import com.oracle.cloud.demo.oe.entities.OrderItem;
import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class OrderItemList {

    private List<OrderItem> orderItems;

    public OrderItemList() {
    }

    public OrderItemList(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

}
