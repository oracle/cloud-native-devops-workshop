package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.Order;

import javax.annotation.PostConstruct;
import javax.enterprise.context.SessionScoped;
import javax.faces.context.FacesContext;
import javax.inject.Named;

@Named("myOrdersController")
@SessionScoped
public class MyOrdersController extends OrdersController {

    @PostConstruct
    public void postConstruct() {
        if (getFilterByCustomerEmail() == null) {
            String userEmail = FacesContext.getCurrentInstance().getExternalContext().getRemoteUser();

            // mock user if it's 'customer'
            if (userEmail != null && userEmail.equals("customer")) {
                userEmail = "Graham.Spielberg@CHUKAR.EXAMPLE.COM";
            }

            setFilterByCustomerEmail(userEmail);
        }
    }

    @Override
    public String prepareList() {
        super.prepareList();
        return "/user/MyOrders?faces-redirect=true";
    }

    @Override
    public String next() {
        super.next();
        return "MyOrders";
    }

    @Override
    public String previous() {
        super.previous();
        return "MyOrders";
    }

    @Override
    public String destroy(Order order) {
        super.destroy(order);
        return "MyOrders";
    }
}
