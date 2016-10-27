package com.oracle.wins.restclient;

import java.util.Calendar;
import java.util.concurrent.TimeUnit;

import javax.annotation.concurrent.ThreadSafe;

import com.oracle.wins.util.OPCProperties;

@ThreadSafe
public class ExecuteBatch {


	public static String createJCSAuto() {

		String result = "";
		int iResult = isStorageContainerExist();

		if ( iResult == OPCProperties.EXIST) {
			return "Can not create storage. Reason: " + OPCProperties.getInstance().getProperty(OPCProperties.OPC_STORAGE_CONTAINER) + " container already exists.";
		} else if (iResult == OPCProperties.FAILED) {
			return "Can not create storage. Reason: Request failed.";
		}

		iResult = isJCSExist();
		if ( iResult == OPCProperties.EXIST) {
			return "Can not Java Cloud Service. Reason: " + OPCProperties.getInstance().getProperty(OPCProperties.JCS_INSTANCE_1) + " instance already exists.";
		} else if (iResult == OPCProperties.FAILED) {
			return "Can not create Java Cloud Service. Reason: Request failed.";
		}

		iResult = isDBCSExist();
		if ( iResult == OPCProperties.EXIST) {
			return "Can not create Database Cloud Service. Reason: " + OPCProperties.getInstance().getProperty(OPCProperties.DBCS_INSTANCE_1) + " instance already exists.";
		} else if (iResult == OPCProperties.FAILED) {
			return "Can not create Database Cloud Service. Reason: Request failed.";
		}

		OPCStorage.createStorage();
		while ((result = OPCStorage.getStorageInformation()) == null || result.indexOf(OPCProperties.getInstance().getProperty(OPCProperties.OPC_STORAGE_CONTAINER)) == -1) {
			System.out.println("Waiting for storage container creation...");
			System.out.println(result);
		}
		System.out.println("Storage has been created. -----------------------------------------------------");

		OPCDatabase.createDBCSInstance();
		do {
			System.out.println(Calendar.getInstance().getTime() + " Waiting for Database Cloud Service provisioning...");
			try {
				TimeUnit.MINUTES.sleep(5);
			} catch (InterruptedException e) {
			    e.printStackTrace();
			}
			result = OPCDatabase.getDBCSInstanceDetail();
			if (result == null) {
				result = "";
			}
			String sLog = result.replace('\n', ' ');
			if (sLog.length() > 130) {
				sLog = sLog.substring(0, 130);
			}
			System.out.println("Response: " + sLog + "...");

		} while (result.indexOf(OPCProperties.SERVICE_STATUS) == -1);
		System.out.println("Database Cloud Service has been created. -----------------------------------------------------");

		OPCJava.createJCSInstance();
		do {
			System.out.println(Calendar.getInstance().getTime() + " Waiting for Java Cloud Service provisioning...");
			try {
			    TimeUnit.MINUTES.sleep(5);
			} catch (InterruptedException e) {
			    e.printStackTrace();
			}
			result = OPCJava.getJCSInstanceDetail();
			if (result == null) {
				result = "";
			}
			String sLog = result.replace('\n', ' ');
			if (sLog.length() > 130) {
				sLog = sLog.substring(0, 130);
			}
			System.out.println("Response: " + sLog + "...");

		} while (result.indexOf(OPCProperties.SERVICE_STATUS) == -1);
		System.out.println("Java Cloud Service has been created. -----------------------------------------------------");

		return "Full Java Cloud Service (including storage, Database Cloud Service) provisioning is ready.";
	}

	public static int isStorageContainerExist() {

		String storageContainer = OPCProperties.getInstance().getProperty(OPCProperties.OPC_STORAGE_CONTAINER);

		System.out.println("Check storage: " + storageContainer);
		int iResult = OPCProperties.NOT_EXIST;

    	String response = OPCStorage.getStorageInformation();

		if (response.startsWith(OPCProperties.HTTP_REQUEST_FAILED)) {
			iResult = OPCProperties.FAILED;
			System.out.println(response);
		} else if (response.indexOf(storageContainer) > -1) {
			iResult = OPCProperties.EXIST;
		}
		return iResult;
	}

	public static int isDBCSExist() {

		String dbcsInstance = OPCProperties.getInstance().getProperty(OPCProperties.DBCS_INSTANCE_1);

		System.out.println("Check DBCS Instance: " + dbcsInstance);
		int iResult = OPCProperties.NOT_EXIST;

    	String response = OPCDatabase.getDBCSInstanceDetail();

    	if (response.startsWith(OPCProperties.HTTP_REQUEST_FAILED) && response.indexOf(OPCProperties.HTTP_ERROR_404_NOT_FOUND) == -1) {
			iResult = OPCProperties.FAILED;
		} else if (response.indexOf(dbcsInstance) > -1) {
			iResult = OPCProperties.EXIST;
		}
		return iResult;
	}


	public static int isJCSExist() {

		String jcsInstance = OPCProperties.getInstance().getProperty(OPCProperties.JCS_INSTANCE_1);

		System.out.println("Check JCS Instance: " + jcsInstance);
		int iResult = OPCProperties.NOT_EXIST;

    	String response = OPCJava.getJCSInstanceDetail();

    	if (response.startsWith(OPCProperties.HTTP_REQUEST_FAILED) && response.indexOf(OPCProperties.HTTP_ERROR_404_NOT_FOUND) == -1) {
			iResult = OPCProperties.FAILED;
		} else if (response.indexOf(jcsInstance) > -1) {
			iResult = OPCProperties.EXIST;
		}
		return iResult;
	}

}