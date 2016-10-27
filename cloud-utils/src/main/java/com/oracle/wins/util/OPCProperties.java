package com.oracle.wins.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Properties;
import java.util.Set;

public class OPCProperties {
	
	public static final String IPADDRESS_PATTERN = "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
	
	public static final String WLS_ADMIN_URL = "wls_admin_url";
	public static final String DB_CONNECT_DESCRIPTOR = "connect_descriptor_with_public_ip";

	public static final String GOAL_JCS_GET_INSTANCE_DETAILS = "jcs-get-instance-details";
	public static final String GOAL_JCS_GET_IP_ADDRESS = "jcs-get-ip";
	public static final String GOAL_DBCS_GET_INSTANCE_DETAILS = "dbcs-get-instance-details";
	public static final String GOAL_DBCS_GET_IP_ADDRESS = "dbcs-get-ip";
	public static final String GOAL_JCS_INSTANCE_DELETE = "jcs-delete";
	public static final String GOAL_DBCS_INSTANCE_DELETE = "dbcs-delete";
	public static final String GOAL_DBCS_INSTANCE_CREATE = "dbcs-create";
	public static final String GOAL_JCS_INSTANCE_CREATE = "jcs-create";
	public static final String GOAL_CREATE_JCS_AUTO = "jcs-create-auto";
	public static final String GOAL_JCS_GET_SPECIFIC_JOB_DETAILS = "jcs-get-job-details";
	public static final String GOAL_GENERATE_SSH_KEYPAIR = "generate-ssh-keypair";

	public static final String GOAL_STORAGE_DETAILS = "storage-get-details";
	public static final String GOAL_STORAGE_CREATE = "storage-create";
	public static final String GOAL_STORAGE_LIST = "storage-list";
	public static final String GOAL_STORAGE_DELETE = "storage-delete";

	public static final String CONTENT_TYPE_VND_SERVICE_JSON = "application/vnd.com.oracle.oracloud.provisioning.Service+json";
	public static final String CONTENT_TYPE_JSON = "application/json";
	public static final String CONTENT_TYPE_TEXT = "text/plain";

	public static final String OPC_BASE_URL = "opc.base.url";
	public static final String OPC_USERNAME = "opc.username";
	public static final String OPC_PASSWORD = "opc.password";
	public static final String OPC_IDENTITY_DOMAIN = "opc.identity.domain";
	public static final String OPC_STORAGE_CONTAINER = "opc.storage.container";
	public static final String OPC_STORAGE_GENERIC_URL = "opc.storage.generic.url";

	public static final String SSH_PUBLIC_KEY = "ssh.public.key";
	public static final String SSH_PASSPHRASE = "ssh.passphrase";

	public static final String JCS_REST_URL = "jcs.rest.url";
	public static final String JCS_INSTANCE_VERSION_1 = "jcs.instance.version.1";
	public static final String JCS_INSTANCE_OTD_1 = "jcs.instance.otd.1";
	public static final String JCS_INSTANCE_1 = "jcs.instance.1";
	public static final String JCS_INSTANCE_DESC_1 = "jcs.instance.desc.1";
	public static final String JCS_INSTANCE_ADMIN_USER_1 = "jcs.instance.admin.user.1";
	public static final String JCS_INSTANCE_ADMIN_PASSWORD_1 = "jcs.instance.admin.password.1";
	public static final String JCS_PARTITION_1 = "jcs.instance.partition.1";

	public static final String DBCS_BASE_URL = "dbcs.base.url";
	public static final String DBCS_REST_URL = "dbcs.rest.url";
	public static final String DBCS_INSTANCE_1 = "dbcs.instance.1";
	public static final String DBCS_INSTANCE_DESC_1 = "dbcs.instance.desc.1";
	public static final String DBCS_INSTANCE_SID_1 = "dbcs.instance.sid.1";
	public static final String DBCS_INSTANCE_PDB1_1 = "dbcs.instance.pdb1.1";
	public static final String DBCS_INSTANCE_VERSION_1 = "dbcs.instance.version.1";
	public static final String DBCS_INSTANCE_USABLE_STORAGE_1 = "dbcs.instance.usable.storage.1";
	public static final String DBCS_INSTANCE_DEMOS_1 = "dbcs.instance.demos.1";

	public static final String DBCS_DBA_NAME = "dbcs.dba.name";
	public static final String DBCS_DBA_PASSWORD = "dbcs.dba.password";

	public static final String HEADER_X_AUTH_TOKEN = "X-Auth-Token";
	public static final String HEADER_X_STORAGE_URL = "X-Storage-Url";

	public static final String SERVICE_STATUS = "Running";

	public static final String HTTP_REQUEST_FAILED = "HTTP Request Failed";
	public static final String HTTP_ERROR_404_NOT_FOUND = "404";

	public static final int EXIST = 0;
	public static final int NOT_EXIST = 1;
	public static final int FAILED = 2;

	private final Properties configProp = new Properties();

	private static OPCProperties INSTANCE = null;


	private OPCProperties() {
	}

	public void init (String sPropertyFile) {
		InputStream in = getClass().getClassLoader().getResourceAsStream(
				sPropertyFile);

		try {
			URL url = getClass().getClassLoader().getResource(sPropertyFile);
			if (url == null) {
				throw new FileNotFoundException("Can not find the specified property file: " + sPropertyFile);
			}
			System.out.println("Read all properties from: " + url.toURI());
			configProp.load(in);
		} catch (IOException | URISyntaxException e) {
			e.printStackTrace();
		}
	}

	public static OPCProperties getInstance() {
		if (INSTANCE == null) {
			INSTANCE = new OPCProperties();
		}
		return INSTANCE;
	}

	public String getProperty(String key) {
		//System.out.println("Property: " + key + "="
			//	+ configProp.getProperty(key));
		return configProp.getProperty(key);
	}

	public Set<String> getAllPropertyNames() {
		return configProp.stringPropertyNames();
	}

	public boolean containsKey(String key) {
		return configProp.containsKey(key);
	}
}
