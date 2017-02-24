package com.oracle.cloud.apaas.example.springboot.rest.entities;

import org.springframework.data.repository.CrudRepository;

public interface CustomerDAO extends CrudRepository<Customer, String>{

}
