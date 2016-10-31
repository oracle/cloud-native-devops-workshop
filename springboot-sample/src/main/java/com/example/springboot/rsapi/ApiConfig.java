package com.example.springboot.rsapi;

import org.apache.cxf.bus.spring.SpringBus;
import org.apache.cxf.endpoint.Server;
import org.apache.cxf.jaxrs.JAXRSServerFactoryBean;
import org.apache.cxf.transport.servlet.CXFServlet;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackageClasses = Api.class)
public class ApiConfig {

    @Autowired private Api apiService;
    
    @Bean(destroyMethod = "shutdown")
    public SpringBus cxf() {
        return new SpringBus();
    }

    @Bean(destroyMethod = "destroy") @DependsOn("cxf")
    public Server jaxRsServer() {
        final JAXRSServerFactoryBean factory = new JAXRSServerFactoryBean();

        factory.setServiceBean(apiService);
        factory.setProvider(new JacksonJsonProvider());
        factory.setBus(cxf());
        factory.setAddress("/");

        return factory.create();
    }

    @Bean
    public ServletRegistrationBean cxfServlet() {
        final ServletRegistrationBean servletRegistrationBean = 
            new ServletRegistrationBean(new CXFServlet(), "/api/*");
        servletRegistrationBean.setLoadOnStartup(1);
        return servletRegistrationBean;
    }
    
}
