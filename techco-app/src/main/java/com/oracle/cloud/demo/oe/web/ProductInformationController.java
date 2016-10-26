package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.ProductInformation;
import com.oracle.cloud.demo.oe.sessions.ProductInformationFacadeRemote;
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

@Named("productInformationController")
@SessionScoped
public class ProductInformationController implements Serializable {
    private ProductInformation current;
    private List<ProductInformation> items;
    private PaginationHelper pagination;
    private String filterByNameOrDesc;

    @EJB
    protected ProductInformationFacadeRemote ejbFacade;

    @PostConstruct
    public void postConstruct() {
        setFilterByNameOrDesc(null);
    }

    public ProductInformation getCurrent() {
        if (current == null) {
            current = new ProductInformation();
        }
        return current;
    }

    public void setCurrent(ProductInformation productInformation) {
        this.current = productInformation;
    }

    public int getNumOfItemsFilter() {
        return getPagination().getPageSize();
    }

    public void setNumOfItemsFilter(int numOfItemsFilter) {
        getPagination().setPageSize(numOfItemsFilter);
        recreateModel();
    }

    protected ProductInformationFacadeRemote getFacade() {
        ejbFacade.setFilterByNameOrDesc(filterByNameOrDesc);
        return ejbFacade;
    }

    public PaginationHelper getPagination() {
        if (pagination == null) {
            pagination = new PaginationHelper(6) {
                @Override
                public int getItemsCount() {
                    return getFacade().count();
                }

                @Override
                public List<ProductInformation> createPageModel() {
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

    public String prepareView(ProductInformation productInformation) {
        current = productInformation;
        return "View";
    }

    public String prepareCreate() {
        current = new ProductInformation();
        return "Create";
    }

    public String create() {
        try {
            getFacade().create(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("ProductInformationCreated"));
            return prepareCreate();
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String prepareEdit(ProductInformation productInformation) {
        current = productInformation;
        return "Edit";
    }

    public String update() {
        try {
            getFacade().edit(current);
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("ProductInformationUpdated"));
            return "View";
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
            return null;
        }
    }

    public String destroy(ProductInformation productInformation) {
        current = productInformation;
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
            JsfUtil.addSuccessMessage(ResourceBundle.getBundle("/Bundle").getString("ProductInformationDeleted"));
        } catch (Exception e) {
            JsfUtil.addErrorMessage(e, ResourceBundle.getBundle("/Bundle").getString("PersistenceErrorOccured"));
        }
    }

    public List<ProductInformation> getItems() {
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

    public ProductInformation getProductInformation(Integer id) {
        return getFacade().find(id);
    }

    @FacesConverter(forClass = ProductInformation.class)
    public static class ProductInformationControllerConverter implements Converter {
        @Override
        public Object getAsObject(FacesContext facesContext, UIComponent component, String value) {
            if (value == null || value.length() == 0) {
                return null;
            }
            ProductInformationController controller = (ProductInformationController) facesContext
                    .getApplication()
                    .getELResolver()
                    .getValue(facesContext.getELContext(), null, "productInformationController");
            return controller.getProductInformation(getKey(value));
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
        public String getAsString(FacesContext facesContext,
                                  UIComponent component, Object object) {
            if (object == null) {
                return null;
            }
            if (object instanceof ProductInformation) {
                ProductInformation o = (ProductInformation) object;
                return getStringKey(o.getProductId());
            } else {
                throw new IllegalArgumentException("object " + object
                        + " is of type " + object.getClass().getName()
                        + "; expected type: "
                        + ProductInformation.class.getName());
            }
        }
    }

    public void setFilterByNameOrDesc(String filterByNameOrDesc) {
        this.filterByNameOrDesc = filterByNameOrDesc;
    }

    public String getFilterByNameOrDesc() {
        return filterByNameOrDesc;
    }

    public void filter() {
        recreateModel();
        recreatePagination();
    }

    public void clearFilter() {
        setFilterByNameOrDesc(null);
        filter();
    }
}
