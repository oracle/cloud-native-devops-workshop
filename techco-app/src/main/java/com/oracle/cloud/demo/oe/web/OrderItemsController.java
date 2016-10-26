package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.OrderItem;
import com.oracle.cloud.demo.oe.entities.OrderItemsPK;
import com.oracle.cloud.demo.oe.sessions.OrderItemsFacadeRemote;
import com.oracle.cloud.demo.oe.web.util.JsfUtil;
import com.oracle.cloud.demo.oe.web.util.PaginationHelper;

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

@Named("orderItemsController")
@SessionScoped
public class OrderItemsController implements Serializable {
    private OrderItem current;
    private List<OrderItem> items;
    private PaginationHelper pagination;

    @EJB
    private OrderItemsFacadeRemote ejbFacade;

    public OrderItem getCurrent() {
        if (current == null) {
            current = new OrderItem();
            current.setOrderItemsPK(new OrderItemsPK());
        }
        return current;
    }

    public void setCurrent(OrderItem orderItem) {
        this.current = orderItem;
    }

    private OrderItemsFacadeRemote getFacade() {
        return ejbFacade;
    }

    public PaginationHelper getPagination() {
        if (pagination == null) {
            pagination = new PaginationHelper(10) {
                @Override
                public int getItemsCount() {
                    return getFacade().count();
                }

                @Override
                public List<OrderItem> createPageModel() {
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

    public String prepareView(OrderItem orderItem) {
        current = orderItem;
        return "View";
    }

    public String prepareCreate() {
        current = new OrderItem();
        current.setOrderItemsPK(new OrderItemsPK());
        return "Create";
    }

    public String create() {
        try {
            current.getOrderItemsPK().setOrderId(current.getOrder().getOrderId());
            getFacade().create(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("OrderItemsCreated"));
            return prepareCreate();
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String prepareEdit(OrderItem orderItem) {
        current = orderItem;
        return "Edit";
    }

    public String update() {
        try {
            current.getOrderItemsPK().setOrderId(current.getOrder().getOrderId());
            getFacade().edit(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("OrderItemsUpdated"));
            return "View";
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String destroy(OrderItem orderItem) {
        current = orderItem;
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
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("OrderItemsDeleted"));
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
        }
    }

    public List<OrderItem> getItems() {
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
        return JsfUtil.getSelectItems(ejbFacade.findAll(), false);
    }

    public SelectItem[] getItemsAvailableSelectOne() {
        return JsfUtil.getSelectItems(ejbFacade.findAll(), true);
    }

    public OrderItem getOrderItem(OrderItemsPK id) {
        return ejbFacade.find(id);
    }

    @FacesConverter(forClass = OrderItem.class)
    public static class OrderItemsControllerConverter implements Converter {
        private static final String SEPARATOR = "#";
        private static final String SEPARATOR_ESCAPED = "\\#";

        @Override
        public Object getAsObject(FacesContext facesContext, UIComponent component, String value) {
            if (value == null || value.length() == 0) {
                return null;
            }
            OrderItemsController controller = (OrderItemsController) facesContext.getApplication().getELResolver().
                    getValue(facesContext.getELContext(), null, "orderItemsController");
            return controller.getOrderItem(getKey(value));
        }

        OrderItemsPK getKey(String value) {
            OrderItemsPK key = new OrderItemsPK();
            String values[] = value.split(SEPARATOR_ESCAPED);
            key.setOrderId(Long.parseLong(values[0]));
            key.setLineItemId(Short.parseShort(values[1]));
            return key;
        }

        String getStringKey(OrderItemsPK value) {
            StringBuilder sb = new StringBuilder();
            sb.append(value.getOrderId());
            sb.append(SEPARATOR);
            sb.append(value.getLineItemId());
            return sb.toString();
        }

        @Override
        public String getAsString(FacesContext facesContext, UIComponent component, Object object) {
            if (object == null) {
                return null;
            }
            if (object instanceof OrderItem) {
                OrderItem o = (OrderItem) object;
                return getStringKey(o.getOrderItemsPK());
            } else {
                throw new IllegalArgumentException("object " + object + " is of type " + object.getClass().getName() + "; expected type: " + OrderItem.class.getName());
            }
        }
    }
}
