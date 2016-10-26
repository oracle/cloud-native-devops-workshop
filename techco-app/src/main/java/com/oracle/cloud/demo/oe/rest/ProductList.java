package com.oracle.cloud.demo.oe.rest;

import com.oracle.cloud.demo.oe.entities.ProductInformation;
import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProductList {

    private List<ProductInformation> products;

    public ProductList() {
    }

    public ProductList(List<ProductInformation> products) {
        this.products = products;
    }

    public List<ProductInformation> getProducts() {
        return products;
    }

    public void setProducts(List<ProductInformation> products) {
        this.products = products;
    }

}
