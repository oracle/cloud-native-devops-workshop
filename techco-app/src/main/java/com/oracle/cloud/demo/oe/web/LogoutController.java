package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.Customer;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.Serializable;

@Named("logoutController")
@RequestScoped
public class LogoutController implements Serializable {
    private String userDisplayName;

    @Inject
    protected CustomersController customersController;

    public String getUserDisplayName() {
        if (userDisplayName == null) {
            userDisplayName = "Anonymous";
            String user = FacesContext.getCurrentInstance().getExternalContext().getRemoteUser();
            if (user != null) {
                try {
                    Customer customer = customersController.getCustomer(user);
                    userDisplayName = customer.getCustFirstName() + " " + customer.getCustLastName();
                }
                catch (Exception e) {
                    userDisplayName = user;
                }
            }
        }
        return userDisplayName;
    }

    public String logout() {
        FacesContext.getCurrentInstance().getExternalContext().invalidateSession();
        return "/logout.xhtml?faces-redirect=true";
    }
}
