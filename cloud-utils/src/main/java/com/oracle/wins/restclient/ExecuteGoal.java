package com.oracle.wins.restclient;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.Header;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;

import com.oracle.wins.keygen.JSCHKeyGenerator;
import com.oracle.wins.util.OPCProperties;

public class ExecuteGoal {

	public static void main(String[] args) {

		OPCProperties opcProperties;
		String response = "";
		String sGoal = "";
		String sJobId = "";

		if (args.length < 2) {
			System.out.println("Not enough parameters defined!");
		} else {
			opcProperties = OPCProperties.getInstance();
			opcProperties.init(args[0]);

			System.out.println("Selected goal: " + args[1]);

			sGoal = args[1];

			if (args.length > 2 && args[2] != null) {
				sJobId = args[2];
			}

			Credentials credOPCUser = null;
			BasicNameValuePair[] aHeaders = null;
			String sUri = null;
			Properties storageProperties = null;

			switch (sGoal.toLowerCase()) {
	        case OPCProperties.GOAL_JCS_GET_INSTANCE_DETAILS:
	        	System.out.println("JCS get specific instance details----------------------------------------");

	        	response = OPCJava.getJCSInstanceDetail();

	        	System.out.println("Output from Server .... \n");
	    		System.out.println(response);

	        	break;
	        case OPCProperties.GOAL_JCS_GET_IP_ADDRESS:
	        	System.out.println("JCS get public IP address----------------------------------------");

	        	response = OPCJava.getJCSInstanceDetail();
	        	
	        	
	        	if (response.indexOf(OPCProperties.WLS_ADMIN_URL) > -1) {
		        	Pattern pattern = Pattern.compile(OPCProperties.IPADDRESS_PATTERN);
		        	Matcher matcher = pattern.matcher(response.substring(response.indexOf(OPCProperties.WLS_ADMIN_URL)));
		        	if (matcher.find()) {
		        	    response = "Public IP address of the JCS instance: " + matcher.group();
		        	} else{
		        	    response = "Can not extract IP address. See the full details:\n" + response;
		        	}
	        	} else {
	        		response = "Can not extract IP address. See the instance details:\n" + response;
	        	}
	        	
	    		System.out.println(response);

	        	break;	        	
	        case OPCProperties.GOAL_DBCS_GET_INSTANCE_DETAILS:
	        	System.out.println("DBCS get specific instance details----------------------------------------");

        		response = OPCDatabase.getDBCSInstanceDetail();

	        	System.out.println("Output from Server .... \n");
	    		System.out.println(response);

	            break;
	        case OPCProperties.GOAL_DBCS_GET_IP_ADDRESS:
	        	System.out.println("DBCS get public IP address----------------------------------------");

	        	response = OPCDatabase.getDBCSInstanceDetail();
	        	
	        	if (response.indexOf(OPCProperties.DB_CONNECT_DESCRIPTOR) > -1) {
		        	Pattern pattern2 = Pattern.compile(OPCProperties.IPADDRESS_PATTERN);
		        	Matcher matcher2 = pattern2.matcher(response.substring(response.indexOf(OPCProperties.DB_CONNECT_DESCRIPTOR)));
		        	if (matcher2.find()) {
		        	    response = "Public IP address of the DBCS instance: " + matcher2.group();
		        	} else{
		        		response = "Can not extract IP address. See the instance details:\n" + response;
		        	}
	        	} else {
	        		response = "Can not extract IP address. See the instance details:\n" + response;
	        	}
	        		
	        	
	    		System.out.println(response);

	        	break;	            
	        case OPCProperties.GOAL_JCS_INSTANCE_DELETE:
	        	System.out.println("JCS delete instance----------------------------------------");

	        	sUri = "https://" + opcProperties.getProperty(OPCProperties.OPC_BASE_URL)
	        			+ opcProperties.getProperty(OPCProperties.JCS_REST_URL)
	        			+ opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN)
	        			+ "/" + opcProperties.getProperty(OPCProperties.JCS_INSTANCE_1);

	        	System.out.println(sUri);

	        	credOPCUser = new UsernamePasswordCredentials(opcProperties.getProperty(OPCProperties.OPC_USERNAME), opcProperties.getProperty(OPCProperties.OPC_PASSWORD));

	        	aHeaders = new BasicNameValuePair[3];

	        	aHeaders[0] = new BasicNameValuePair("accept", opcProperties.getProperty(OPCProperties.CONTENT_TYPE_JSON));
	        	aHeaders[1] = new BasicNameValuePair("X-ID-TENANT-NAME", opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));
	        	aHeaders[2] = new BasicNameValuePair("Content-Type", OPCProperties.CONTENT_TYPE_VND_SERVICE_JSON);

	    		StringEntity seBody = null;
	    		try {
	    			seBody = new StringEntity("{\"dbaName\":\""
	    					+ opcProperties.getProperty(OPCProperties.DBCS_DBA_NAME)
	    					+ "\",\"dbaPassword\":\""
	    					+ opcProperties.getProperty(OPCProperties.DBCS_DBA_PASSWORD)
	    					+ "\"}");
	    		} catch (UnsupportedEncodingException e) {
	    			e.printStackTrace();
	    			throw new RuntimeException("Failed to construct body: " + e.getMessage());
	    		}

	    		response = ApacheHttpClientPut.httpClientPUT(sUri, aHeaders, seBody, credOPCUser, false);

	    		System.out.println("Output from Server .... \n");
	    		System.out.println(response);
	            break;
	        case OPCProperties.GOAL_DBCS_INSTANCE_DELETE:
	        	System.out.println("DBCS delete instance----------------------------------------");

	        	sUri = "https://" + opcProperties.getProperty(OPCProperties.OPC_BASE_URL)
	        			+ opcProperties.getProperty(OPCProperties.DBCS_REST_URL)
	        			+ opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN)
	        			+ "/" + opcProperties.getProperty(OPCProperties.DBCS_INSTANCE_1);

	        	System.out.println(sUri);

	        	credOPCUser = new UsernamePasswordCredentials(opcProperties.getProperty(OPCProperties.OPC_USERNAME), opcProperties.getProperty(OPCProperties.OPC_PASSWORD));

	        	aHeaders = new BasicNameValuePair[2];

	        	aHeaders[0] = new BasicNameValuePair("accept", opcProperties.getProperty(OPCProperties.CONTENT_TYPE_JSON));
	        	aHeaders[1] = new BasicNameValuePair("X-ID-TENANT-NAME", opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));

	    		response = ApacheHttpClientDelete.httpClientDELETE(sUri, aHeaders, null, credOPCUser);

	    		System.out.println("Output from Server .... \n");
	    		System.out.println(response);
	            break;
	        case OPCProperties.GOAL_DBCS_INSTANCE_CREATE:
	        	System.out.println("DBCS create instance----------------------------------------");

	    		response = OPCDatabase.createDBCSInstance();

	    		System.out.println("Response.... \n");
	    		System.out.println(response);
	            break;
	        case OPCProperties.GOAL_JCS_INSTANCE_CREATE:
	        	System.out.println("JCS create instance----------------------------------------");

	        	response = OPCJava.createJCSInstance();

	    		System.out.println("Output from Server .... \n");
	    		System.out.println(response);
	            break;
	        case OPCProperties.GOAL_JCS_GET_SPECIFIC_JOB_DETAILS:
	        	System.out.println("JCS get specific instance creation details----------------------------------------");

	        	aHeaders = new BasicNameValuePair[2];

	        	aHeaders[0] = new BasicNameValuePair("accept", OPCProperties.CONTENT_TYPE_JSON);
	        	aHeaders[1] = new BasicNameValuePair("X-ID-TENANT-NAME", opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));

				sUri = "http://" + opcProperties.getProperty(OPCProperties.OPC_BASE_URL)
						+ opcProperties.getProperty(OPCProperties.JCS_REST_URL)
						+ opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN)
						+ "/" + "status/create/job/" + sJobId;

				credOPCUser = new UsernamePasswordCredentials(opcProperties.getProperty(OPCProperties.OPC_USERNAME), opcProperties.getProperty(OPCProperties.OPC_PASSWORD));

	    		response = ApacheHttpClientGet.httpClientGET(sUri, aHeaders, null, credOPCUser);

	    		System.out.println("Output from Server .... \n");
	    		System.out.println(response);
	            break;
	        case OPCProperties.GOAL_STORAGE_CREATE:
	        	System.out.println("Create storage----------------------------------------");

	        	response = OPCStorage.createStorage();

	        	System.out.println("Output from Server .... \n");
	    		System.out.println(response);
	        	break;
	        case OPCProperties.GOAL_STORAGE_LIST:
	        	System.out.println("List storage endpoints----------------------------------------");

	        	response = OPCStorage.getStorageInformation();

	        	System.out.println("Output from Server .... \n");
	    		System.out.println(response);
	        	break;

	        case OPCProperties.GOAL_STORAGE_DELETE:
	        	System.out.println("Delete storage endpoints----------------------------------------");
	        	
	        	long tokenTimeStart = System.currentTimeMillis();

	        	storageProperties = getStorageAuthToken(
	    				opcProperties.getProperty(OPCProperties.OPC_USERNAME),
	    				opcProperties.getProperty(OPCProperties.OPC_PASSWORD),
	    				opcProperties.getProperty(OPCProperties.OPC_STORAGE_GENERIC_URL),
	    				opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));

	        	sUri = storageProperties.getProperty(OPCProperties.HEADER_X_STORAGE_URL);

	        	aHeaders = new BasicNameValuePair[1];

	        	aHeaders[0] = new BasicNameValuePair("X-Auth-Token", storageProperties.getProperty(OPCProperties.HEADER_X_AUTH_TOKEN));

	        	//list objects in container into file
	        	response = ApacheHttpClientGet.httpClientGET(sUri + "/" + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER), aHeaders, null, null);

	        	boolean needDelete = true;

	        	if(response.indexOf("Not Found") > -1) {
	        		System.out.println("Not found container: " + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER));
	        		needDelete = false;
	        	} else if (response.indexOf("Executon failed") > -1) {
	        		System.out.println("Execution failed for container: " + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER));
	        		needDelete = false;
	        	} else if (response.indexOf("No Content") == -1) {

	        		/*TODO: BULK DELETE IS NOT WORKING!!!
	        		response = response.replace("\n", "\n" + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER) + "/");
					response = opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER) + "/" + response;
					response = response.substring(0, response.lastIndexOf(opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER)));
					
					aHeaders = new BasicNameValuePair[2];

		        	aHeaders[0] = new BasicNameValuePair("X-Auth-Token", storageProperties.getProperty(OPCProperties.HEADER_X_AUTH_TOKEN));
		        	aHeaders[1] = new BasicNameValuePair("Content-Type", storageProperties.getProperty(OPCProperties.CONTENT_TYPE_TEXT));

		        	seBody = null;
		        	try {
						seBody = new StringEntity(response);
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}

		        	//delete objects in the container
		        	response = ApacheHttpClientDelete.httpClientDELETE(sUri + "/?bulk-delete", aHeaders, seBody, null);
	        		*/
	        		
	        		//System.out.println("Objects query: " + (response.length() > 1000 ? response.substring(0, 1000) + "...and more" : response));

					aHeaders = new BasicNameValuePair[1];
		        	aHeaders[0] = new BasicNameValuePair("X-Auth-Token", storageProperties.getProperty(OPCProperties.HEADER_X_AUTH_TOKEN));
	        		
		        	
	        		//delete objects 1 by 1
					String[] lines = response.split("\n");
					System.out.println("Number of objects to delete: " + lines.length);
					for (int i = 0; i < lines.length; i++) {
						
						if (System.currentTimeMillis() - tokenTimeStart > 600000) {
							System.out.println("Authentication token for storage will expire. Getting new one.");
							
							tokenTimeStart = System.currentTimeMillis();
				        	storageProperties = getStorageAuthToken(
				    				opcProperties.getProperty(OPCProperties.OPC_USERNAME),
				    				opcProperties.getProperty(OPCProperties.OPC_PASSWORD),
				    				opcProperties.getProperty(OPCProperties.OPC_STORAGE_GENERIC_URL),
				    				opcProperties.getProperty(OPCProperties.OPC_IDENTITY_DOMAIN));
							aHeaders[0] = new BasicNameValuePair("X-Auth-Token", storageProperties.getProperty(OPCProperties.HEADER_X_AUTH_TOKEN));
						}
						
						
						response = ApacheHttpClientDelete.httpClientDELETE(
								sUri + "/"  + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER) + "/" + lines[i], aHeaders, null, null, true);
			            if ((lines.length - i) % 100 == 0) {
			                System.out.println("Number of objects to delete: " + (lines.length - i));
			            }
					}

	        	}

	        	//delete container
	        	if (needDelete) {
		        	aHeaders = new BasicNameValuePair[1];

		        	aHeaders[0] = new BasicNameValuePair("X-Auth-Token", storageProperties.getProperty(OPCProperties.HEADER_X_AUTH_TOKEN));

		        	response = ApacheHttpClientDelete.httpClientDELETE(sUri + "/" + opcProperties.getProperty(OPCProperties.OPC_STORAGE_CONTAINER), aHeaders, null, null);

		        	System.out.println("Output from Server .... \n");
		    		System.out.println(response);
	        	}
	        	break;

	        case OPCProperties.GOAL_CREATE_JCS_AUTO:
	        	System.out.println("Create JCS including Storage, DBCS ----------------------------------------");

	        	response = ExecuteBatch.createJCSAuto();
	        	System.out.println(response);

	        	break;
	        case OPCProperties.GOAL_GENERATE_SSH_KEYPAIR:
	        	System.out.println("Generate SSH key pair ----------------------------------------");
	        	System.out.println("WARNING! This will create new public and private key and overwrite the existing keypairs!");
	        	System.out.println("The current keypairs will be copied with date postfix.");

				String passphrase = opcProperties.getProperty(OPCProperties.SSH_PASSPHRASE);
	        	System.out.println("Passphrase used from properties file (" + args[0] + "): " + (passphrase == null || passphrase.length() == 0 ? "Passphrase NOT defined" : passphrase));
	        	System.out.println();

	        	String datePostfix =  new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());

	        	URL url = opcProperties.getClass().getClassLoader().getResource(args[0]);
	        	Path pathWorkingdir;
				try {
					pathWorkingdir = Paths.get(url.toURI()).getParent();
				} catch (URISyntaxException e1) {
					System.out.println("Failure during determine working dir.");
					e1.printStackTrace();
					break;
				}

	        	System.out.println("Working dir: " + pathWorkingdir.toAbsolutePath() + File.separator);

	        	//backup existing private key
	        	File file = new File(pathWorkingdir + File.separator + "pk.openssh");
	        	File backupFile = new File(pathWorkingdir + File.separator + "pk.openssh." + datePostfix);

	        	file.renameTo(backupFile);

	        	System.out.println("Private key backup: " + "pk.openssh." + datePostfix);

	        	//backup public key from properties file to separate file
	        	FileInputStream in;
				try {
		        	in = new FileInputStream(new File(pathWorkingdir + File.separator + args[0]));
		        	Properties props = new Properties();
		        	props.load(in);
		        	in.close();

		        	PrintWriter out = new PrintWriter(pathWorkingdir + File.separator + "public.key." + datePostfix);

		        	out.print(props.get(OPCProperties.SSH_PUBLIC_KEY));
		        	out.close();

		        	System.out.println("Public key backup: " + "public.key." + datePostfix);

				} catch (IOException e) {
					e.printStackTrace();
					System.out.println("Failure during private key backup.");
					break;
				}

				//generate new keypair
				response = JSCHKeyGenerator.generateKeys(pathWorkingdir + File.separator + "pk.openssh", opcProperties.getProperty(OPCProperties.SSH_PASSPHRASE));
				//System.out.println("Public key: " + response);

				//replace public key in properties file
				try {

					System.out.println("Replacing public key in property file:" + pathWorkingdir + File.separator + args[0]);
					List<String> fileContent = new ArrayList<>(Files.readAllLines(Paths.get(pathWorkingdir + File.separator + args[0]), StandardCharsets.UTF_8));

					for (int i = 0; i < fileContent.size(); i++) {
					    if (fileContent.get(i).startsWith(OPCProperties.SSH_PUBLIC_KEY)) {
					        fileContent.set(i, OPCProperties.SSH_PUBLIC_KEY + "=ssh-rsa " + response + " rsa-key-" + datePostfix);
					        break;
					    }
					}

					Files.write(Paths.get(pathWorkingdir + File.separator + args[0]), fileContent, StandardCharsets.UTF_8);
				} catch (IOException e) {
					e.printStackTrace();
					response = "Failure during public key update.";
				}


				response = "Keypair has been generated.";

	        	System.out.println(response);

	        	break;
	        default:
	        	System.out.println("Wrong goal specified: " + sGoal);
	            break;
			}
		}

	}

	public static Properties getStorageAuthToken(String sUsername, String sPassword,
			String sStorageUrl, String sIdentityDomain) {

		Properties storageProp = new Properties();

		try {

			CloseableHttpClient httpclient = HttpClients.custom().build();
			HttpGet httpget = new HttpGet("https://" + sIdentityDomain + "." + sStorageUrl + "/auth/v1.0");
			httpget.addHeader("X-Storage-User", "Storage-" + sIdentityDomain + ":" + sUsername);
			httpget.addHeader("X-Storage-Pass", sPassword);

			System.out.println("Executing request " + httpget.getRequestLine());
			CloseableHttpResponse response = httpclient.execute(httpget);

			System.out.println("Response: " + response.getStatusLine());

			if (response.getStatusLine().getStatusCode() != 200) {
				System.out.println("FAILED check the error : HTTP error code : "
						+ response.getStatusLine().getStatusCode());
			}

			Header[] headers = response.getAllHeaders();

			for (Header header: headers) {

				if (header.getName().contains(OPCProperties.HEADER_X_AUTH_TOKEN)) {
					System.out.println("auth token:" + header.getValue());
					storageProp.setProperty(OPCProperties.HEADER_X_AUTH_TOKEN, header.getValue());
				} else if (header.getName().contains(OPCProperties.HEADER_X_STORAGE_URL)) {
					System.out.println("storage url:" + header.getValue());
					storageProp.setProperty(OPCProperties.HEADER_X_STORAGE_URL, header.getValue());
				}
			}

			response.close();

		} catch (IOException e) {

			e.printStackTrace();
		}

		return storageProp;
	}


}