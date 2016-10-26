package com.oracle.cloud.demo.oe.sessions;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

public interface AbstractFacadeRemote<T> {

    EntityManager getEntityManager();

    void create(T entity) ;

    void edit(T entity) ;

    void remove(T entity) ;

    T find(Object id) ;

    List<T> findAll() ;

    List<T> findRange(int[] range) ;

    int count();

    CriteriaQuery filterQuery(CriteriaQuery query, Root<T> rt) ;

    CriteriaQuery orderByQuery(CriteriaQuery query, Root<T> rt) ;
}
