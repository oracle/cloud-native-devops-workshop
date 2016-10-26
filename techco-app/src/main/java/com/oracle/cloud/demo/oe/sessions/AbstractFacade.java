package com.oracle.cloud.demo.oe.sessions;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.io.Serializable;
import java.util.List;

public abstract class AbstractFacade<T>  implements Serializable, AbstractFacadeRemote<T>{
	private static final long serialVersionUID = 1L;
    protected final Class<T> entityClass;

    public AbstractFacade(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    public abstract EntityManager getEntityManager();

    public void create(T entity) {
        getEntityManager().persist(entity);
    }

    public void edit(T entity) {
        getEntityManager().merge(entity);
    }

    public void remove(T entity) {
        getEntityManager().remove(getEntityManager().merge(entity));
    }

    public T find(Object id) {
        return getEntityManager().find(entityClass, id);
    }

    public List<T> findAll() {
        CriteriaQuery cq = getEntityManager().getCriteriaBuilder().createQuery();
        Root<T> rt = cq.from(entityClass);
        cq.select(rt);
        return getEntityManager().createQuery(orderByQuery(filterQuery(cq, rt), rt)).getResultList();
    }

    public List<T> findRange(int[] range) {
        CriteriaQuery cq = getEntityManager().getCriteriaBuilder().createQuery();
        Root<T> rt = cq.from(entityClass);
        cq.select(rt);
        Query q = getEntityManager().createQuery(orderByQuery(filterQuery(cq, rt), rt));
        q.setMaxResults(range[1] - range[0]);
        q.setFirstResult(range[0]);
        return q.getResultList();
    }

    public int count() {
        CriteriaQuery cq = getEntityManager().getCriteriaBuilder().createQuery();
        Root<T> rt = cq.from(entityClass);
        cq.select(getEntityManager().getCriteriaBuilder().count(rt));
        Query q = getEntityManager().createQuery(filterQuery(cq, rt));
        return ((Long) q.getSingleResult()).intValue();
    }

    public CriteriaQuery filterQuery(CriteriaQuery query, Root<T> rt) {
        return query;
    }

    public CriteriaQuery orderByQuery(CriteriaQuery query, Root<T> rt) {
        return query;
    }

}
