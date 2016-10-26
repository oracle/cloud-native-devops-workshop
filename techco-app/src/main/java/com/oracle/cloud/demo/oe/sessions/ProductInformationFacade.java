package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.entities.ProductInformation;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Stateless(name="ProductInformationFacade")
public class ProductInformationFacade extends AbstractFacade<ProductInformation> implements ProductInformationFacadeRemote, Serializable {
    private static final long serialVersionUID = 1L;
    private List<Integer> filterByCategoryIds = new ArrayList<>();
    private String filterByNameOrDesc;

    @PersistenceContext
    private EntityManager em;

    public ProductInformationFacade() {
        super(ProductInformation.class);
    }

    public EntityManager getEntityManager() {
        return em;
    }

    @Override
    public void setFilterByCategoryId(Integer filterByCategoryId) {
        List<Integer> categoryIdList;
        if (filterByCategoryId == 10) { // all hardware
            categoryIdList = Arrays.asList(new Integer[]{11, 12, 13, 14, 15, 16, 17, 19});
        } else if (filterByCategoryId == 101) { // monitors, printers, harddisks
            categoryIdList = Arrays.asList(new Integer[]{11, 12, 13});
        } else if (filterByCategoryId == 102) { // components
            categoryIdList = Arrays.asList(new Integer[]{14, 15});
        } else if (filterByCategoryId == 103) { // accessories
            categoryIdList = Arrays.asList(new Integer[]{16, 17, 19});
        } else if (filterByCategoryId == 20) { // software
            categoryIdList = Arrays.asList(new Integer[]{21, 22, 23, 24, 25, 29});
        } else if (filterByCategoryId == 30) { // office
            categoryIdList = Arrays.asList(new Integer[]{31, 32, 33, 39});
        } else { // all products
            categoryIdList = Arrays.asList(new Integer[]{11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23, 24, 25, 29, 31, 32, 33, 39});
        }
        setFilterByCategoryIds(categoryIdList);
    }

    @Override
    public void setFilterByCategoryIds(List<Integer> filterByCategoryIds) {
        this.filterByCategoryIds = filterByCategoryIds;
    }

    @Override
    public String getFilterByNameOrDesc() {
        return filterByNameOrDesc;
    }

    @Override
    public void setFilterByNameOrDesc(String filterByNameOrDesc) {
        this.filterByNameOrDesc = filterByNameOrDesc;
    }

    @Override
    public CriteriaQuery filterQuery(CriteriaQuery query, Root<ProductInformation> rt) {
        if (filterByNameOrDesc != null || (filterByCategoryIds != null && !filterByCategoryIds.isEmpty())) {
            CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
            Predicate nameCondition = null, categoryCondition = null;
            if (filterByNameOrDesc != null && !filterByNameOrDesc.trim().isEmpty()) {
                nameCondition = cb.or(
                        cb.like(cb.lower(rt.<String>get("productName")), "%" + filterByNameOrDesc.toLowerCase() + "%"),
                        cb.like(cb.lower(rt.<String>get("productDescription")), "%" + filterByNameOrDesc.toLowerCase() + "%"));
            }
            if (filterByCategoryIds != null && !filterByCategoryIds.isEmpty()) {
                categoryCondition = rt.<String>get("categoryId").in(filterByCategoryIds);
            }
            if (nameCondition != null && categoryCondition != null) {
                query.where(cb.and(categoryCondition, nameCondition));
            }
            else if (nameCondition != null) {
                query.where(nameCondition);
            }
            else if (categoryCondition != null) {
                query.where(categoryCondition);
            }
        }
        return query;
    }

    @Override
    public CriteriaQuery orderByQuery(CriteriaQuery query, Root<ProductInformation> rt) {
        CriteriaBuilder cb = getEntityManager().getCriteriaBuilder();
        return query.orderBy(cb.asc(rt.get("productId")));
    }

    public List<ProductInformation> findByCategory(Integer categoryId) {
        setFilterByCategoryId(categoryId);
        return findAll();
    }
}
