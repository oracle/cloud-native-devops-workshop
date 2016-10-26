package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.OrderItem;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;

@Stateless
public class OrderItemsFacade extends AbstractFacade<OrderItem> implements Serializable, OrderItemsFacadeRemote {
    @PersistenceContext
    private EntityManager em;

    @Override
	public EntityManager getEntityManager() {
        return em;
    }

    public OrderItemsFacade() {
        super(OrderItem.class);
    }
}
