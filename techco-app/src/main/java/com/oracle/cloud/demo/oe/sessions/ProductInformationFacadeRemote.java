package com.oracle.cloud.demo.oe.sessions;

import com.oracle.cloud.demo.oe.entities.ProductInformation;

import javax.ejb.Remote;
import java.util.List;

@Remote
public interface ProductInformationFacadeRemote extends AbstractFacadeRemote<ProductInformation> {

    String getFilterByNameOrDesc();

    void setFilterByNameOrDesc(String nameOrDesc);

    void setFilterByCategoryId(Integer filterByCategoryId);

    void setFilterByCategoryIds(List<Integer> filterByCategoryIds);

    List<ProductInformation> findByCategory(Integer categoryId);
}
