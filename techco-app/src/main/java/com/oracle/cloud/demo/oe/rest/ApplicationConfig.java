package com.oracle.cloud.demo.oe.rest;

import org.eclipse.persistence.jaxb.rs.MOXyJsonProvider;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("rest")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    @Override
    public Set<Object> getSingletons() {
        MOXyJsonProvider moxyJsonProvider = new MOXyJsonProvider();
        moxyJsonProvider.setFormattedOutput(true);

        HashSet<Object> set = new HashSet<>(1);
        set.add(moxyJsonProvider);
        return set;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(com.oracle.cloud.demo.oe.rest.CustomersResource.class);
        resources.add(com.oracle.cloud.demo.oe.rest.OrdersResource.class);
        resources.add(com.oracle.cloud.demo.oe.rest.ProductsResource.class);
        resources.add(com.oracle.cloud.demo.oe.rest.UrlsResource.class);
    }

}
