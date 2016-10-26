package com.oracle.cloud.demo.oe.web.util;

import com.oracle.cloud.demo.oe.entities.ProductInformation;

import javax.enterprise.context.SessionScoped;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

@XmlRootElement
@SessionScoped
public class BasketItem implements Serializable {

    @NotNull
    private ProductInformation product;
    @Min(0)
    private int quantity = 0;

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 41 * hash + Objects.hashCode(this.product);
        hash = 41 * hash + this.quantity;
        return hash;
    }

    public BigDecimal getSubtotal() {
        return new BigDecimal(quantity).multiply(product.getListPrice());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final BasketItem other = (BasketItem) obj;
        if (!Objects.equals(this.product, other.product)) {
            return false;
        }
        if (this.quantity != other.quantity) {
            return false;
        }
        return true;
    }

    public ProductInformation getProduct() {
        return product;
    }

    public void setProduct(ProductInformation product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

}
