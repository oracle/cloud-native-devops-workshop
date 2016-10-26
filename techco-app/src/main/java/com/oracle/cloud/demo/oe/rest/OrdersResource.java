package com.oracle.cloud.demo.oe.rest;

import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.entities.OrderItem;
import com.oracle.cloud.demo.oe.sessions.CheckoutSessionBeanRemote;
import com.oracle.cloud.demo.oe.sessions.OrdersFacadeRemote;
import com.oracle.cloud.demo.oe.web.util.BasketItem;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.*;
import java.util.Collections;
import java.util.List;

@Path("orders")
@RequestScoped
public class OrdersResource {

    @EJB
    OrdersFacadeRemote orderDao;

    @EJB
    CheckoutSessionBeanRemote checkoutBean;

    @GET
    @Path("fromCustomer/{customerEmail}")
    @Produces("application/json")
    public OrderList byCustomer(@PathParam("customerEmail") String customerEmail) {
        List<Order> list = orderDao.getOrdersByCustomerEmail(customerEmail);
        if (list == null) {
            list = Collections.emptyList();
        }

        for (Order o : list) {
            o.setCustomer(null);
        }

        return new OrderList(list);
    }

    @GET
    @Path("fromCustomer/{customerEmail}/{orderId}")
    @Produces("application/json")
    public OrderItemList items(@PathParam("orderId") Integer orderId, @PathParam("customerEmail") String customerEmail) {
        List<OrderItem> list = orderDao.getItemsByCustomerEmailAndOrderId(customerEmail, orderId);
        if (list == null) {
            list = Collections.emptyList();
        }
        for (OrderItem oi : list) {
            oi.setOrder(null);
        }
        return new OrderItemList(list);
    }

    @PUT
    @Path("newOrder/{customerEmail}")
    @Consumes("application/json")
    @Produces("application/json")
    public Order newOrder(@PathParam("customerEmail") String customerEmail, List<BasketItem> basketItems) {
        return checkoutBean.checkout(customerEmail, basketItems);
    }

}
