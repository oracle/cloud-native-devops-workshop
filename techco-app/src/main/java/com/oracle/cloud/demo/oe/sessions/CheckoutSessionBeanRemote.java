package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.web.util.BasketItem;

import javax.ejb.Remote;
import java.math.BigDecimal;
import java.util.List;

@Remote
public interface CheckoutSessionBeanRemote {

	public Order checkout(String user, List<BasketItem> basketItems);

    public BigDecimal calculateTotal(List<BasketItem> basketItems) ;
}
