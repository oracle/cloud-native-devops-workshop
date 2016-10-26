package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.Customer;
import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.entities.OrderItem;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;

@Stateless(name="OrdersFacade")
public class OrdersFacade extends AbstractFacade<Order> implements OrdersFacadeRemote, Serializable {
	private static final long serialVersionUID = 1L;
    private String filterByCustomerEmail;

	@PersistenceContext
	private EntityManager em;

	public OrdersFacade() {
		super(Order.class);
	}

	@Override
	public EntityManager getEntityManager() {
        return em;
    }

    public void setFilterByCustomerEmail(String email) {
        this.filterByCustomerEmail = email;
    }

	public String getFilterByCustomerEmail() {
		return this.filterByCustomerEmail;
	}

    public List<Order> getOrdersByCustomerEmail(String customerEmail) {
        return em.createNamedQuery("Order.findByCustomerEmail")
				.setParameter("customerEmail", customerEmail).getResultList();
    }

	public List<OrderItem> getItemsByCustomerEmailAndOrderId(String customerEmail, Integer orderId) {
		List<OrderItem> orderItems = (List<OrderItem>) em
				.createNamedQuery("OrderItem.findByOrderIdAndCustomerEmail")
                .setParameter("customerEmail", customerEmail)
				.setParameter("orderId", orderId).getResultList();
        if (orderItems == null) {
            return Collections.emptyList();
        }
		return orderItems;
	}

	@Override
	public CriteriaQuery filterQuery(CriteriaQuery query, Root<Order> rt) {
		if (filterByCustomerEmail != null && !filterByCustomerEmail.trim().isEmpty()) {
			CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
			query.where(cb.like(
					cb.lower(rt.<Customer>get("customer").<String>get("custEmail")), "%" + filterByCustomerEmail.toLowerCase() + "%")
			);
		}
		return query;
	}

	@Override
	public CriteriaQuery orderByQuery(CriteriaQuery query, Root<Order> rt) {
		CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
		return query.orderBy(cb.desc(rt.get("orderDate")));
	}
}
