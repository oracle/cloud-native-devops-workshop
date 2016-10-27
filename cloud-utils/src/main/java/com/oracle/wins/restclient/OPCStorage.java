package com.oracle.wins.restclient;

import java.util.Properties;

import org.apache.http.message.BasicNameValuePair;

import com.oracle.wins.util.OPCProperties;

public class OPCStorage {
	
	public static String getStorageInformation() {
		
		OPCProperties opcProperties = OPCProperties.getInstance();
		
		Properties storageProperties = ExecuteGoal.getStorageAuthToken(
				opcProperties.getProperty(OPCProperties.OPC_USERNAME),
				opcProperties.getProperty(OPCProperties.OPC_PASSWORD),
				opcProperties.getProperty(OPCProperties.OPC_STORAGE_GENERIC_URL),
				opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));
    	
    	BasicNameValuePair[] aHeaders = null;
		String sUri = null;	
    	
    	sUri = storageProperties.getProperty(OPCProperties.HEADER_X_STORAGE_URL);
    	
    	aHeaders = new BasicNameValuePair[1];
    	
    	aHeaders[0] = new BasicNameValuePair("X-Auth-Token", storageProperties.getProperty(OPCProperties.HEADER_X_AUTH_TOKEN));

		
		return ApacheHttpClientGet.httpClientGET(sUri, aHeaders, null, null);
		
	}
	
	public static String createStorage() {
		
		OPCProperties opcProperties = OPCProperties.getInstance();
		Properties storageProperties = ExecuteGoal.getStorageAuthToken(
				opcProperties.getProperty(OPCProperties.OPC_USERNAME),
				opcProperties.getProperty(OPCProperties.OPC_PASSWORD),
				opcProperties.getProperty(OPCProperties.OPC_STORAGE_GENERIC_URL),
				opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));
		
    	BasicNameValuePair[] aHeaders = null;
		String sUri = null;	

    	sUri = storageProperties.getProperty(OPCProperties.HEADER_X_STORAGE_URL) + "/" + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER);
    	
    	aHeaders = new BasicNameValuePair[1];
    	
    	aHeaders[0] = new BasicNameValuePair("X-Auth-Token", storageProperties.getProperty(OPCProperties.HEADER_X_AUTH_TOKEN));
    	
    	return ApacheHttpClientPut.httpClientPUT(sUri, aHeaders, null, null, true);
	}

}
