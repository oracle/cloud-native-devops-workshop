package com.oracle.cloud.demo.oe.rest;

import com.oracle.cloud.demo.oe.sessions.ProductInformationFacadeRemote;

import javax.ejb.EJB;
import javax.enterprise.context.RequestScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("products")
@RequestScoped
public class ProductsResource {

    @EJB
    ProductInformationFacadeRemote prodDao;

    @GET
    @Path("all")
    @Produces("application/json")
    public ProductList all() {
        return new ProductList(prodDao.findAll());
    }

    @GET
    @Path("category/{id}")
    @Produces("application/json")
    public ProductList all(@PathParam("id") Integer categoryId) {
        return new ProductList(prodDao.findByCategory(categoryId));
    }
}
