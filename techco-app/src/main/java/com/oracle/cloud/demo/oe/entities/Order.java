package com.oracle.cloud.demo.oe.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Collection;

@Entity
@Table(name = "ORDERS")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Order.findAll", query = "SELECT o FROM Order o"),
    @NamedQuery(name = "Order.findByOrderId", query = "SELECT o FROM Order o WHERE o.orderId = :orderId"),
    @NamedQuery(name = "Order.findByOrderDate", query = "SELECT o FROM Order o WHERE o.orderDate = :orderDate"),
    @NamedQuery(name = "Order.findByOrderMode", query = "SELECT o FROM Order o WHERE o.orderMode = :orderMode"),
    @NamedQuery(name = "Order.findByCustomerEmail", query = "SELECT o FROM Order o WHERE o.customer.custEmail = :customerEmail"),
    @NamedQuery(name = "Order.findByOrderStatus", query = "SELECT o FROM Order o WHERE o.orderStatus = :orderStatus"),
    @NamedQuery(name = "Order.findByOrderTotal", query = "SELECT o FROM Order o WHERE o.orderTotal = :orderTotal"),
    @NamedQuery(name = "Order.findBySalesRepId", query = "SELECT o FROM Order o WHERE o.salesRepId = :salesRepId"),
    @NamedQuery(name = "Order.findByPromotionId", query = "SELECT o FROM Order o WHERE o.promotionId = :promotionId")})
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @SequenceGenerator(name = "appUsersSeq", sequenceName = "ORDERS_SEQ", allocationSize = 1, initialValue = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "appUsersSeq")
    @Column(name = "ORDER_ID", nullable = false)
    private Long orderId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "ORDER_DATE")
    private Timestamp orderDate;
    @Size(max = 8)
    @Column(name = "ORDER_MODE")
    private String orderMode;
    @Column(name = "ORDER_STATUS")
    private Short orderStatus;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "ORDER_TOTAL")
    private BigDecimal orderTotal;
    @Column(name = "SALES_REP_ID")
    private Integer salesRepId;
    @Column(name = "PROMOTION_ID")
    private Integer promotionId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private Collection<OrderItem> orderItemsCollection;
    @JoinColumn(name = "CUSTOMER_ID", referencedColumnName = "CUSTOMER_ID")
    @ManyToOne(optional = false)
    private Customer customer;

    public Order() {
    }

    public Order(Long orderId) {
        this.orderId = orderId;
    }

    public Order(Long orderId, Timestamp orderDate) {
        this.orderId = orderId;
        this.orderDate = orderDate;
    }

    public Order(Customer customer, Timestamp orderDate, Long orderId, String orderMode, Short orderStatus,
            BigDecimal orderTotal, Integer promotionId, Integer salesRepId) {
        this.customer = customer;
        this.orderDate = orderDate;
        this.orderId = orderId;
        this.orderMode = orderMode;
        this.orderStatus = orderStatus;
        this.orderTotal = orderTotal;
        this.promotionId = promotionId;
        this.salesRepId = salesRepId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderMode() {
        return orderMode;
    }

    public void setOrderMode(String orderMode) {
        this.orderMode = orderMode;
    }

    public Short getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(Short orderStatus) {
        this.orderStatus = orderStatus;
    }

    public BigDecimal getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(BigDecimal orderTotal) {
        this.orderTotal = orderTotal;
    }

    public Integer getSalesRepId() {
        return salesRepId;
    }

    public void setSalesRepId(Integer salesRepId) {
        this.salesRepId = salesRepId;
    }

    public Integer getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(Integer promotionId) {
        this.promotionId = promotionId;
    }

    @XmlTransient
    public Collection<OrderItem> getOrderItemsCollection() {
        return orderItemsCollection;
    }

    public void setOrderItemsCollection(Collection<OrderItem> orderItemsCollection) {
        this.orderItemsCollection = orderItemsCollection;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (orderId != null ? orderId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Order)) {
            return false;
        }
        Order other = (Order) object;
        if ((this.orderId == null && other.orderId != null) || (this.orderId != null && !this.orderId.equals(other.orderId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.oracle.samples.mavenproject2.Orders[ orderId=" + orderId + " ]";
    }

}
