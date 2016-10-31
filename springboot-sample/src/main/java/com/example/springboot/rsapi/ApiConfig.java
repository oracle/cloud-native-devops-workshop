package com.example.springboot.rsapi;

import org.apache.cxf.jaxrs.servlet.CXFNonSpringJaxrsServlet;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration
@ComponentScan
public class ApiConfig {

    @Bean
    public ServletRegistrationBean cxfServlet() {
        final ServletRegistrationBean servletRegistrationBean =
            new ServletRegistrationBean(new CXFNonSpringJaxrsServlet(), "/api/*");
        servletRegistrationBean.setLoadOnStartup(1);
        servletRegistrationBean.addInitParameter("jaxrs.serviceClasses", "com.example.springboot.rsapi.Api");
        servletRegistrationBean.addInitParameter("jaxrs.providers", "org.codehaus.jackson.jaxrs.JacksonJsonProvider");
        return servletRegistrationBean;
    }
    
}
