package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.sessions.CheckoutSessionBeanRemote;
import com.oracle.cloud.demo.oe.web.util.BasketItem;

import javax.ejb.EJB;
import javax.enterprise.context.SessionScoped;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Named("basket")
@SessionScoped
public class BasketController implements Serializable {
    private final List<BasketItem> products = new ArrayList<>();
    private BigDecimal total = BigDecimal.ZERO;

    @EJB
    protected CheckoutSessionBeanRemote checkoutBean;

    @Inject
    protected MyOrdersController myOrdersController;

    @Inject
    protected CustomersController customersController;

    public BigDecimal getTotal() {
        return total;
    }

    public List<BasketItem> getProducts() {
        return products;
    }

    public int getCount(){
        return products.size();
    }

    public void addItem(BasketItem bi) {
        BasketItem existingItem = null;
        for (BasketItem cartItem : products) {
            if (cartItem.getProduct().equals(bi.getProduct())) {
                existingItem = cartItem;
                break;
            }
        }
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + 1);

        } else {
            products.add(bi);
        }
        total = total.add(bi.getSubtotal());
    }

    public void addItems(List<BasketItem> basketItemsToAdd) {
        for (BasketItem p : basketItemsToAdd) {
            addItem(p);
        }
    }

    public void removeItem(BasketItem item) {
        products.remove(item);
        total = total.subtract(item.getSubtotal());
    }

    public void clearBasket() {
        products.clear();
        total = BigDecimal.ZERO;
    }

    public void loadCustomerInfo(){
    	//This is important!!
        String user = FacesContext.getCurrentInstance().getExternalContext().getRemoteUser();
        customersController.setCurrent(customersController.getCustomer(user));
        myOrdersController.setFilterByCustomerEmail(user);
    }

    public String prepareCheckout(){
        if (products.isEmpty()) {
            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_WARN, "Product list is empty. You must first add products to the basket.", ""));
            return "/shop/Basket";
        }
        return "/user/Checkout?faces-redirect=true";
    }

    public String checkout() {

        String user = FacesContext.getCurrentInstance().getExternalContext().getRemoteUser();
        Order order = checkoutBean.checkout(user, products);
        myOrdersController.setCurrent(order);
        clearBasket();

        return "/user/ViewLastPlacedOrder";
    }

    public String updateTotal(){
        total = BigDecimal.ZERO;
        for (BasketItem cartItem : products) {
            total = total.add(cartItem.getSubtotal());
        }
        return "Basket";
    }
}
