package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.OrderItem;

import javax.ejb.Remote;

@Remote
public interface OrderItemsFacadeRemote extends AbstractFacadeRemote<OrderItem> {
}
