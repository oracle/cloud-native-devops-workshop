package com.oracle.cloud.demo.oe.entities;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;

@Embeddable
public class OrderItemsPK implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "ORDER_ID")
    private long orderId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "LINE_ITEM_ID")
    private short lineItemId;

    public OrderItemsPK() {
    }

    public OrderItemsPK(long orderId, short lineItemId) {
        this.orderId = orderId;
        this.lineItemId = lineItemId;
    }

    public long getOrderId() {
        return orderId;
    }

    public void setOrderId(long orderId) {
        this.orderId = orderId;
    }

    public short getLineItemId() {
        return lineItemId;
    }

    public void setLineItemId(short lineItemId) {
        this.lineItemId = lineItemId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) orderId;
        hash += (int) lineItemId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof OrderItemsPK)) {
            return false;
        }
        OrderItemsPK other = (OrderItemsPK) object;
        if (this.orderId != other.orderId) {
            return false;
        }
        if (this.lineItemId != other.lineItemId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.oracle.samples.mavenproject2.OrderItemsPK[ orderId=" + orderId + ", lineItemId=" + lineItemId + " ]";
    }

}
