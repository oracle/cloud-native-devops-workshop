package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.Customer;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.io.Serializable;

@Stateless
public class CustomersFacade extends AbstractFacade<Customer> implements CustomersFacadeRemote, Serializable {
    private static final long serialVersionUID = 1L;
    private String filterByEmail;

    @PersistenceContext
    private EntityManager em;

    @Override
	public EntityManager getEntityManager() {
        return em;
    }

    public CustomersFacade() {
        super(Customer.class);
    }

    public void setFilterByEmail(String email) {
        this.filterByEmail = email;
    }

    public String getFilterByEmail() {
        return this.filterByEmail;
    }

    public Customer getCustomerByEmail(String email) {
        return (Customer) em.createNamedQuery("Customer.findByCustEmail")
                .setParameter("custEmail", email).getSingleResult();
    }

    @Override
    public CriteriaQuery filterQuery(CriteriaQuery query, Root<Customer> rt) {
        if (filterByEmail != null && !filterByEmail.trim().isEmpty()) {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            query.where(cb.like(
                    cb.lower(rt.<String>get("custEmail")), "%" + filterByEmail.toLowerCase() + "%")
            );
        }
        return query;
    }
}
