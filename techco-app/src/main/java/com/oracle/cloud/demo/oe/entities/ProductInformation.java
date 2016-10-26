package com.oracle.cloud.demo.oe.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Collection;

@Entity
@Table(name = "PRODUCT_INFORMATION")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "ProductInformation.findAll", query = "SELECT p FROM ProductInformation p"),
    @NamedQuery(name = "ProductInformation.findByProductId", query = "SELECT p FROM ProductInformation p WHERE p.productId = :productId"),
    @NamedQuery(name = "ProductInformation.findByProductName", query = "SELECT p FROM ProductInformation p WHERE p.productName = :productName"),
    @NamedQuery(name = "ProductInformation.findByProductDescription", query = "SELECT p FROM ProductInformation p WHERE p.productDescription = :productDescription"),
    @NamedQuery(name = "ProductInformation.findByCategoryId", query = "SELECT p FROM ProductInformation p WHERE p.categoryId = :categoryId"),
    @NamedQuery(name = "ProductInformation.findByCategoryIds", query = "SELECT p FROM ProductInformation p WHERE p.categoryId IN :categoryIdList"),
    @NamedQuery(name = "ProductInformation.findByWeightClass", query = "SELECT p FROM ProductInformation p WHERE p.weightClass = :weightClass"),
    @NamedQuery(name = "ProductInformation.findByProductStatus", query = "SELECT p FROM ProductInformation p WHERE p.productStatus = :productStatus"),
    @NamedQuery(name = "ProductInformation.findByListPrice", query = "SELECT p FROM ProductInformation p WHERE p.listPrice = :listPrice"),
    @NamedQuery(name = "ProductInformation.findByMinPrice", query = "SELECT p FROM ProductInformation p WHERE p.minPrice = :minPrice"),
    @NamedQuery(name = "ProductInformation.findByCatalogUrl", query = "SELECT p FROM ProductInformation p WHERE p.catalogUrl = :catalogUrl")})
public class ProductInformation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @NotNull
    @Column(name = "PRODUCT_ID")
    private Integer productId;
    @Size(max = 50)
    @Column(name = "PRODUCT_NAME")
    private String productName;
    @Size(max = 2000)
    @Column(name = "PRODUCT_DESCRIPTION")
    private String productDescription;
    @Column(name = "CATEGORY_ID")
    private Short categoryId;
    @Column(name = "WEIGHT_CLASS")
    private Short weightClass;
    @Size(max = 20)
    @Column(name = "PRODUCT_STATUS")
    private String productStatus;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "LIST_PRICE")
    private BigDecimal listPrice;
    @Column(name = "MIN_PRICE")
    private BigDecimal minPrice;
    @Size(max = 50)
    @Column(name = "CATALOG_URL")
    private String catalogUrl;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "productId", fetch = FetchType.LAZY)
    private Collection<OrderItem> orderItemCollection;

    public ProductInformation() {
    }

    public ProductInformation(Integer productId) {
        this.productId = productId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public Short getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Short categoryId) {
        this.categoryId = categoryId;
    }

    public Short getWeightClass() {
        return weightClass;
    }

    public void setWeightClass(Short weightClass) {
        this.weightClass = weightClass;
    }

    public String getProductStatus() {
        return productStatus;
    }

    public void setProductStatus(String productStatus) {
        this.productStatus = productStatus;
    }

    public BigDecimal getListPrice() {
        return listPrice;
    }

    public void setListPrice(BigDecimal listPrice) {
        this.listPrice = listPrice;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public String getCatalogUrl() {
        return catalogUrl;
    }

    public void setCatalogUrl(String catalogUrl) {
        this.catalogUrl = catalogUrl;
    }

    @XmlTransient
    public Collection<OrderItem> getOrderItemCollection() {
        return orderItemCollection;
    }

    public void setOrderItemCollection(Collection<OrderItem> orderItemCollection) {
        this.orderItemCollection = orderItemCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (productId != null ? productId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ProductInformation)) {
            return false;
        }

        ProductInformation other = (ProductInformation) object;

        return this.productId.equals(other.productId);
    }

    @Override
    public String toString() {
        return "com.oracle.samples.mavenproject2.ProductInformation[ productId=" + productId + " ]";
    }

}
