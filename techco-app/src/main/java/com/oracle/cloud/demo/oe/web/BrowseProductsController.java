package com.oracle.cloud.demo.oe.web;

import com.oracle.cloud.demo.oe.entities.ProductInformation;
import com.oracle.cloud.demo.oe.sessions.ProductInformationFacadeRemote;
import com.oracle.cloud.demo.oe.web.util.BasketItem;
import com.oracle.cloud.demo.oe.web.util.UrlCache;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import java.io.File;
import java.util.*;

@ManagedBean(name="browseProductsController")
@ViewScoped
public class BrowseProductsController extends ProductInformationController {
    private final Map<Integer, ProductInformation> productCache = new HashMap<>();
    private final Map<String, String> productCategories = new TreeMap<>();
    private Integer currentProductId;
    private Integer currentQuantity = 1;
    private Integer categoryId = 90;

    @Inject
    protected BasketController basket;

    @PostConstruct
    public void postConstruct() {
        if (productCategories.isEmpty()) {
            productCategories.put("20", "Software");
            productCategories.put("30", "Office");
            productCategories.put("90", "Online Catalog");
            productCategories.put("101", "Hardware");
            productCategories.put("102", "Equipment");
            productCategories.put("103", "Others");
        }
        if (productCache.isEmpty()) {
            for (ProductInformation prodInfo : ejbFacade.findAll()) {
                productCache.put(prodInfo.getProductId(), prodInfo);
            }
        }
        ejbFacade.setFilterByNameOrDesc(null);
    }

    public BasketController getBasket() {
        return basket;
    }

    public void setBasket(BasketController basket) {
        this.basket = basket;
    }

    public String getCatalogUrlForCurrentProduct() {
        return UrlCache.getUrl("product:"+getCurrent().getProductId()+":default");
    }

    @Override
    protected ProductInformationFacadeRemote getFacade() {
        ejbFacade.setFilterByCategoryId(getCategoryId());
        return super.getFacade();
    }

    @Override
    public String prepareList() {
        return "/shop/BrowseProducts";
    }

    @Override
    public String next() {
        super.next();
        return null;
    }

    @Override
    public String previous() {
        super.previous();
        return null;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public Map<String, String> getProductCategories() {
        return productCategories;
    }

    public String getCategoryName() {
        return productCategories.get(getCategoryId().toString());
    }

    public Integer getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(Integer currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public void setCurrentProductId(Integer currentProductId) {
        this.currentProductId = currentProductId;
    }

    public Integer getCurrentProductId() {
        return currentProductId;
    }

    public void loadCurrentProductInformation() {
        setCurrent(productCache.get(currentProductId));
    }

    public void loadCategoryProducts() {
        getFacade().setFilterByCategoryId(getCategoryId());
    }

    public String addToBasket() {
        addToBasket(productCache.get(getCurrent().getProductId()));
       return "BrowseProducts?category=101&faces-redirect=true"; // hard-code category to hardware for now
    }

    public String addToBasket(ProductInformation productInformation) {
        BasketItem basketItem = new BasketItem();
        basketItem.setProduct(productInformation);
        basketItem.setQuantity(getCurrentQuantity());
        basket.addItem(basketItem);
        String cartMessage =  productInformation.getProductName() + " Added to Cart";
        Map<String, Object> viewMap = FacesContext.getCurrentInstance().getViewRoot().getViewMap();
        viewMap.put("cartAddMessage", cartMessage);
        return null;
    }

    public String checkImage(String imgname){
        String filename = "img/products/" + imgname + ".png";
        String newpath = "resources/default/" + filename;
        //System.out.println("\nfilename : " + newpath);
        FacesContext facesContext = FacesContext.getCurrentInstance();
        String absoluteFilePath = facesContext.getExternalContext().getRealPath(newpath);
        //System.out.println("\nabsoluteFilePath : " + absoluteFilePath);
        File f = new File(absoluteFilePath);
        if(f.exists()){
            return filename;
        }else{
            return "img/products/noimage.jpg";
        }
    }
}
