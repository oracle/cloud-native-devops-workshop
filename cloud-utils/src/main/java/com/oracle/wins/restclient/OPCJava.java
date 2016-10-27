package com.oracle.wins.restclient;

import java.io.UnsupportedEncodingException;

import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;

import com.oracle.wins.util.OPCProperties;

public class OPCJava {
	
	public static String getJCSInstanceDetail() {
		
		OPCProperties opcProperties = OPCProperties.getInstance();
		BasicNameValuePair[] aHeaders = null;
		String sUri = null;	
		
		aHeaders = new BasicNameValuePair[2];
    	
    	aHeaders[0] = new BasicNameValuePair("accept", OPCProperties.CONTENT_TYPE_JSON);
    	aHeaders[1] = new BasicNameValuePair("X-ID-TENANT-NAME", opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));
    	
		sUri = "http://" + opcProperties.getProperty(OPCProperties.OPC_BASE_URL) 
				+ opcProperties.getProperty(OPCProperties.JCS_REST_URL)
				+ opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN)
				+ "/" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_1);
    	
		Credentials credOPCUser = new UsernamePasswordCredentials(opcProperties.getProperty(OPCProperties.OPC_USERNAME), opcProperties.getProperty(OPCProperties.OPC_PASSWORD));
		
		return ApacheHttpClientGet.httpClientGET(sUri, aHeaders, null, credOPCUser);
		
	}
	
	public static String createJCSInstance() {
		
		OPCProperties opcProperties = OPCProperties.getInstance();
		StringBuffer sbTemp = new StringBuffer();
		sbTemp.append("{");
		sbTemp.append("    \"serviceName\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_1) + "\",");
		sbTemp.append("	   \"level\" : \"PAAS\",");
		sbTemp.append("    \"subscriptionType\" : \"HOURLY\",");
		sbTemp.append("    \"description\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_DESC_1) + "\",");
		sbTemp.append("    \"enableAdminConsole\": \"true\",");
		sbTemp.append("    \"provisionOTD\" : " + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_OTD_1) + " ,");
		sbTemp.append("    \"cloudStorageContainer\" : \"Storage-" + opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN) + "/" + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER) + "\",");
		sbTemp.append("    \"cloudStorageUser\" : \"" + opcProperties.getProperty(OPCProperties.OPC_USERNAME) + "\",");
		sbTemp.append("    \"cloudStoragePassword\" : \"" + opcProperties.getProperty(OPCProperties.OPC_PASSWORD) + "\",");
		sbTemp.append("    \"parameters\" : [");
		sbTemp.append("    {");
		sbTemp.append("        \"type\" : \"weblogic\",");
		sbTemp.append("        \"version\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_VERSION_1) + "\",");
		sbTemp.append("        \"edition\" : \"EE\",");
		sbTemp.append("        \"domainMode\" : \"PRODUCTION\",");
		sbTemp.append("        \"domainPartitionCount\" : \"" + opcProperties.getProperty(OPCProperties.JCS_PARTITION_1) + "\",");
		sbTemp.append("        \"managedServerCount\" : \"1\",");
		sbTemp.append("        \"adminPort\" : \"7001\",");
		sbTemp.append("        \"deploymentChannelPort\" : \"9001\",");
		sbTemp.append("        \"securedAdminPort\" : \"7002\",");
		sbTemp.append("        \"contentPort\" : \"8001\",");
		sbTemp.append("        \"securedContentPort\" : \"8002\",");
		sbTemp.append("        \"domainName\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_1) + "_domain\",");
		sbTemp.append("        \"clusterName\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_1) + "_cluster\",");
		sbTemp.append("        \"adminUserName\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_ADMIN_USER_1) + "\",");
		sbTemp.append("        \"adminPassword\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_ADMIN_PASSWORD_1) + "\",");
		sbTemp.append("        \"nodeManagerPort\" : \"6555\",");
		sbTemp.append("        \"nodeManagerUserName\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_ADMIN_USER_1) + "\",");
		sbTemp.append("        \"nodeManagerPassword\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_ADMIN_PASSWORD_1) + "\",");
		sbTemp.append("        \"dbServiceName\" : \"" + opcProperties.getProperty(OPCProperties.DBCS_INSTANCE_1) + "\",");
		sbTemp.append("        \"dbaName\" : \"" + opcProperties.getProperty(OPCProperties.DBCS_DBA_NAME) + "\",");
		sbTemp.append("        \"dbaPassword\" : \"" + opcProperties.getProperty(OPCProperties.DBCS_DBA_PASSWORD) + "\",");
		sbTemp.append("        \"shape\" : \"oc3\",");
	//	sbTemp.append("        \"domainVolumeSize\" : \"10G\",");
	//	sbTemp.append("        \"backupVolumeSize\" : \"10G\",");
		sbTemp.append("        \"VMsPublicKey\" : \"" + opcProperties.getProperty(OPCProperties.SSH_PUBLIC_KEY) + "\"");
		sbTemp.append("    }");
		
		if (opcProperties.getProperty(OPCProperties.JCS_INSTANCE_OTD_1).equals("true")) {
			sbTemp.append(",    {");
			sbTemp.append("        \"type\" : \"otd\",");
			sbTemp.append("        \"adminUserName\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_ADMIN_USER_1) + "\",");
	        sbTemp.append("        \"adminPassword\" : \"" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_ADMIN_PASSWORD_1) + "\",");
	        sbTemp.append("        \"listenerPortsEnabled\" : true,");
	        sbTemp.append("        \"listenerType\" : \"http\",");
	        sbTemp.append("        \"loadBalancingPolicy\" : \"least_connection_count\",");
	        sbTemp.append("        \"privilegedListenerPort\" : \"80\",");
	        sbTemp.append("        \"privilegedSecuredListenerPort\" : \"443\",");
	        sbTemp.append("        \"adminPort\" : \"8989\",");
	        sbTemp.append("        \"shape\" : \"oc3\",");
	        sbTemp.append("        \"VMsPublicKey\" : \"" + opcProperties.getProperty(OPCProperties.SSH_PUBLIC_KEY) + "\"");
	        sbTemp.append("    }");
		}
		
		sbTemp.append("    ]");
		sbTemp.append("}");
		
		StringEntity seBody = null;
		try {
			seBody = new StringEntity(sbTemp.toString());
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("Failed to construct body: " + e.getMessage());
		}
		
		return ApacheHttpClientPost.httpClientPOST(
				opcProperties.getProperty(OPCProperties.OPC_USERNAME),
				opcProperties.getProperty(OPCProperties.OPC_PASSWORD),
				opcProperties.getProperty(OPCProperties.JCS_REST_URL),
				opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN),
				opcProperties.getProperty(OPCProperties.JCS_INSTANCE_1),
				opcProperties.getProperty(OPCProperties.OPC_BASE_URL),
				OPCProperties.CONTENT_TYPE_VND_SERVICE_JSON,
				seBody);
		
	}

}
