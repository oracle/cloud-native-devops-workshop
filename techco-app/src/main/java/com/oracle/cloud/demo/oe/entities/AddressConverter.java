package com.oracle.cloud.demo.oe.entities;

import org.eclipse.persistence.platform.database.converters.StructConverter;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Struct;

public class AddressConverter implements StructConverter {
    @Override
    public String getStructName() {
        return "OE.CUST_ADDRESS_TYP";
    }

    @Override
    public Class getJavaType() {
        return Address.class;
    }

    @Override
    public Object convertToObject(Struct struct) throws SQLException {
        Object[] attrs = struct.getAttributes();
        return new Address((String)attrs[0], (String)attrs[1], (String)attrs[2], (String)attrs[3], (String)attrs[4]);
    }

    @Override
    public Struct convertToStruct(Object o, Connection connection) throws SQLException {
        return connection.createStruct(getStructName(), ((Address)o).getObjects());
    }
}
