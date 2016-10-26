package com.oracle.cloud.demo.oe.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@Table(name = "ORDER_ITEMS")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "OrderItem.findAll", query = "SELECT o FROM OrderItem o"),
    @NamedQuery(name = "OrderItem.findByOrderId", query = "SELECT o FROM OrderItem o WHERE o.orderItemsPK.orderId = :orderId"),
    @NamedQuery(name = "OrderItem.findByOrderIdAndCustomerEmail", query = "SELECT o FROM OrderItem o WHERE o.orderItemsPK.orderId = :orderId and o.order.customer.custEmail = :customerEmail"),
    @NamedQuery(name = "OrderItem.findByLineItemId", query = "SELECT o FROM OrderItem o WHERE o.orderItemsPK.lineItemId = :lineItemId"),
    @NamedQuery(name = "OrderItem.findByUnitPrice", query = "SELECT o FROM OrderItem o WHERE o.unitPrice = :unitPrice"),
    @NamedQuery(name = "OrderItem.findByQuantity", query = "SELECT o FROM OrderItem o WHERE o.quantity = :quantity")})
public class OrderItem implements Serializable {

    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected OrderItemsPK orderItemsPK;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "UNIT_PRICE")
    private BigDecimal unitPrice;
    @Column(name = "QUANTITY")
    private Integer quantity;
    @JoinColumn(name = "ORDER_ID", referencedColumnName = "ORDER_ID", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Order order;
    @JoinColumn(name = "PRODUCT_ID", referencedColumnName = "PRODUCT_ID")
    @ManyToOne(optional = false)
    private ProductInformation productId;

    public OrderItem() {
    }

    public OrderItem(OrderItemsPK orderItemsPK) {
        this.orderItemsPK = orderItemsPK;
    }

    public OrderItem(long orderId, short lineItemId) {
        this.orderItemsPK = new OrderItemsPK(orderId, lineItemId);
    }

    public OrderItem(Short lineItemId, Order order, ProductInformation productInfo, Integer quantity,
            BigDecimal unitPrice) {
        this(new OrderItemsPK(order.getOrderId(), lineItemId));
        this.order = order;
        this.productId = productInfo;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public OrderItemsPK getOrderItemsPK() {
        return orderItemsPK;
    }

    public void setOrderItemsPK(OrderItemsPK orderItemsPK) {
        this.orderItemsPK = orderItemsPK;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public ProductInformation getProductId() {
        return productId;
    }

    public void setProductId(ProductInformation productId) {
        this.productId = productId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (orderItemsPK != null ? orderItemsPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof OrderItem)) {
            return false;
        }
        OrderItem other = (OrderItem) object;
        if ((this.orderItemsPK == null && other.orderItemsPK != null) || (this.orderItemsPK != null && !this.orderItemsPK.equals(other.orderItemsPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.oracle.samples.mavenproject2.OrderItems[ orderItemsPK=" + orderItemsPK + " ]";
    }

}
