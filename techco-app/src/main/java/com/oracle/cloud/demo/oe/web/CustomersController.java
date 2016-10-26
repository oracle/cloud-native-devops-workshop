package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.Customer;
import com.oracle.cloud.demo.oe.sessions.CustomersFacadeRemote;
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

@Named("customersController")
@SessionScoped
public class CustomersController implements Serializable {
    private Customer current;
    private List<Customer> items;
    private PaginationHelper pagination;
    private String filterByEmail;

    @EJB
    private CustomersFacadeRemote ejbFacade;

    @PostConstruct
    public void postConstruct() {
        setFilterByEmail(null);
    }

    public Customer getCurrent() {
    	// This is great code!!!!
        if (current == null) {
            current = new Customer();
        }
        return current;
    }

    public void setCurrent(Customer customer) {
        this.current = customer;
    }

    private CustomersFacadeRemote getFacade() {
        ejbFacade.setFilterByEmail(filterByEmail);
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
                public List<Customer> createPageModel() {
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

    public String prepareView(Customer customer) {
        current = customer;
        return "View";
    }

    public String prepareCreate() {
        current = new Customer();
        return "Create";
    }

    public String create() {
        try {
            getFacade().create(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("CustomersCreated"));
            return prepareCreate();
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String prepareEdit(Customer customer) {
        current = customer;
        return "Edit";
    }

    public String update() {
        try {
            getFacade().edit(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("CustomersUpdated"));
            return "View";
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String destroy(Customer customer) {
        current = customer;
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
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("CustomersDeleted"));
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
        }
    }

    public List<Customer> getItems() {
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

    public Customer getCustomer(Integer id) {
        return getFacade().find(id);
    }

    public Customer getCustomer(String email) {
        return getFacade().getCustomerByEmail(email);
    }

    @FacesConverter(forClass = Customer.class)
    public static class CustomersControllerConverter implements Converter {

        @Override
        public Object getAsObject(FacesContext facesContext, UIComponent component, String value) {
            if (value == null || value.length() == 0) {
                return null;
            }
            CustomersController controller = (CustomersController) facesContext.getApplication().getELResolver().
                    getValue(facesContext.getELContext(), null, "customersController");
            return controller.getCustomer(getKey(value));
        }

        Integer getKey(String value) {
            Integer key = Integer.valueOf(value);
            return key;
        }

        String getStringKey(Integer value) {
            StringBuilder sb = new StringBuilder();
            sb.append(value);
            return sb.toString();
        }

        @Override
        public String getAsString(FacesContext facesContext, UIComponent component, Object object) {
            if (object == null) {
                return null;
            }
            if (object instanceof Customer) {
                Customer o = (Customer) object;
                return getStringKey(o.getCustomerId());
            } else {
                throw new IllegalArgumentException("object " + object + " is of type " + object.getClass().getName() + "; expected type: " + Customer.class.getName());
            }
        }
    }

    public void setFilterByEmail(String filterByEmail) {
        this.filterByEmail = filterByEmail;
    }

    public String getFilterByEmail() {
        return filterByEmail;
    }

    public void filter() {
        recreateModel();
        recreatePagination();
    }

    public void clearFilter() {
        setFilterByEmail(null);
        filter();
    }
}
