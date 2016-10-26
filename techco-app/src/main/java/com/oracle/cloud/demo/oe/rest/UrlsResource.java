package com.oracle.cloud.demo.oe.rest;

import com.oracle.cloud.demo.oe.web.util.UrlCache;

import javax.enterprise.context.RequestScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("urls")
@RequestScoped
public class UrlsResource {

    @GET
    @Path("{type}/{name}/{view}")
    @Produces("application/json")
    public String getUrl(@PathParam("type") String type, @PathParam("name") String name, @PathParam("view") String view) {
        return UrlCache.getUrl(type + ":" + name + ":" + view);
    }
}
