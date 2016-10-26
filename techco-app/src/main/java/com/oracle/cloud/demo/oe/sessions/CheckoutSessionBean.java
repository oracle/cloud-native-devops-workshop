package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.Customer;
import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.entities.OrderItem;
import com.oracle.cloud.demo.oe.web.util.BasketItem;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Stateless
public class CheckoutSessionBean implements Serializable, CheckoutSessionBeanRemote {
	private static final long serialVersionUID = 1L;

    @EJB
    CustomersFacadeRemote customerDao;

    @EJB
    OrdersFacadeRemote orderDao;

    @EJB
    OrderItemsFacadeRemote orderItemDao;

    @EJB
    ProductInformationFacadeRemote productInformationDao;

    public Order checkout(String user, List<BasketItem> basketItems) {
        String userEmail = user;

        // mock user if it's 'customer'
        if (user.equals("customer")) {
            userEmail = "Graham.Spielberg@CHUKAR.EXAMPLE.COM";
        }

        Customer cust = customerDao.getCustomerByEmail(userEmail);
        BigDecimal total = calculateTotal(basketItems);
        Order order = new Order(cust, new Timestamp((new Date()).getTime()), 0L, "online", (short) 1, total, 1, null);

        orderDao.create(order);
        List<OrderItem> items = new ArrayList();
        order.setOrderItemsCollection(items);

        short itemId = 1;
        for (BasketItem basketItem : basketItems) {
            OrderItem orderItem = new OrderItem(itemId++, order,
                    basketItem.getProduct(),
                    basketItem.getQuantity(),
                    basketItem.getSubtotal());

            orderItemDao.create(orderItem);
            items.add(orderItem);
        }

        return order;
    }

    public BigDecimal calculateTotal(List<BasketItem> basketItems) {
        BigDecimal total = BigDecimal.ZERO;
        for (BasketItem bi : basketItems) {
            total = total.add(bi.getSubtotal());
        }
        return total;
    }
}
