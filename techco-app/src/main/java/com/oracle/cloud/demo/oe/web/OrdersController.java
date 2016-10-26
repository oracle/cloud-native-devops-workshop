package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.Order;
import com.oracle.cloud.demo.oe.sessions.OrdersFacadeRemote;
import com.oracle.cloud.demo.oe.web.util.JsfUtil;
import com.oracle.cloud.demo.oe.web.util.PaginationHelper;

import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.enterprise.context.SessionScoped;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;
import javax.faces.convert.FacesConverter;
import javax.faces.model.SelectItem;
import javax.inject.Named;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

@Named("ordersController")
@SessionScoped
public class OrdersController implements Serializable {
    private Order current;
    private List<Order> items;
    private PaginationHelper pagination;
    private String filterByCustomerEmail;

    @EJB
    private OrdersFacadeRemote ejbFacade;

    @PostConstruct
    public void postConstruct() {
        setFilterByCustomerEmail(null);
    }

    public Order getCurrent() {
        if (current == null) {
            current = new Order();
        }
        return current;
    }

    public void setCurrent(Order order) {
        this.current = order;
    }

    public int getNumOfItemsFilter() {
        return getPagination().getPageSize();
    }

    public void setNumOfItemsFilter(int numOfItemsFilter) {
        getPagination().setPageSize(numOfItemsFilter);
        recreateModel();
    }

    private OrdersFacadeRemote getFacade() {
        ejbFacade.setFilterByCustomerEmail(filterByCustomerEmail);
        return ejbFacade;
    }

    public PaginationHelper getPagination() {
        if (pagination == null) {
            pagination = new PaginationHelper(5) {
                @Override
                public int getItemsCount() {
                    return getFacade().count();
                }

                @Override
                public List<Order> createPageModel() {
                    return new ArrayList(getFacade().findRange(new int[]{getPageFirstItem(), getPageFirstItem() + getPageSize()}));
                }
            };
        }
        return pagination;
    }

    public String prepareList() {
        recreateModel();
        return "List";
    }

    public String prepareView(Order order) {
    	// This is important!!!
        current = order;
        return "View";
    }

    public String prepareCreate() {
        current = new Order();
        return "Create";
    }

    public String create() {
        try {
            getFacade().create(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("OrdersCreated"));
            return prepareCreate();
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String prepareEdit(Order order) {
        current = order;
        return "Edit";
    }

    public String update() {
        try {
            getFacade().edit(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("OrdersUpdated"));
            return "View";
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String destroy(Order order) {
        current = order;
        performDestroy();
        if (getItems().size() <= 1) {
            pagination.previousPage();
        }
        recreateModel();
        return "List";
    }

    public String destroy() {
        return destroy(current);
    }

    private void performDestroy() {
        try {
            getFacade().remove(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("OrdersDeleted"));
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
        }
    }

    public List<Order> getItems() {
        if (items == null) {
            items = getPagination().createPageModel();
        }
        return items;
    }

    private void recreateModel() {
        items = null;
    }

    private void recreatePagination() {
        pagination = null;
    }

    public String next() {
        getPagination().nextPage();
        recreateModel();
        return "List";
    }

    public String previous() {
        getPagination().previousPage();
        recreateModel();
        return "List";
    }

    public SelectItem[] getItemsAvailableSelectMany() {
        return JsfUtil.getSelectItems(getFacade().findAll(), false);
    }

    public SelectItem[] getItemsAvailableSelectOne() {
        return JsfUtil.getSelectItems(getFacade().findAll(), true);
    }

    public Order getOrder(Long id) {
        return getFacade().find(id);
    }

    @FacesConverter(forClass = Order.class)
    public static class OrdersControllerConverter implements Converter {

        @Override
        public Object getAsObject(FacesContext facesContext, UIComponent component, String value) {
            if (value == null || value.length() == 0) {
                return null;
            }
            OrdersController controller = (OrdersController) facesContext.getApplication().getELResolver().
                    getValue(facesContext.getELContext(), null, "ordersController");
            return controller.getOrder(getKey(value));
        }

        Long getKey(String value) {
            Long key = Long.valueOf(value);
            return key;
        }

        String getStringKey(Long value) {
            StringBuilder sb = new StringBuilder();
            sb.append(value);
            return sb.toString();
        }

        @Override
        public String getAsString(FacesContext facesContext, UIComponent component, Object object) {
            if (object == null) {
                return null;
            }
            if (object instanceof Order) {
                Order o = (Order) object;
                return getStringKey(o.getOrderId());
            } else {
                throw new IllegalArgumentException("object " + object + " is of type " + object.getClass().getName() + "; expected type: " + Order.class.getName());
            }
        }
    }

    public void setFilterByCustomerEmail(String filterByCustomerEmail) {
        this.filterByCustomerEmail = filterByCustomerEmail;
    }

    public String getFilterByCustomerEmail() {
        return filterByCustomerEmail;
    }

    public void filter() {
        recreateModel();
        recreatePagination();
    }

    public void clearFilter() {
        setFilterByCustomerEmail(null);
        filter();
    }
}
