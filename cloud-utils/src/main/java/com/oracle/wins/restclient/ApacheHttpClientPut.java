package com.oracle.wins.restclient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;

import com.oracle.wins.util.OPCProperties;

public class ApacheHttpClientPut {

	public static String httpClientPUT(String sUri, BasicNameValuePair[] aHeaders, 
			StringEntity seBody, Credentials credOPCUser, boolean bStorage) {

		StringBuffer sbOutput = new StringBuffer();
		try {

			CloseableHttpClient httpClient = null;
			
			if (credOPCUser != null) {
				CredentialsProvider credsProvider = new BasicCredentialsProvider();
				credsProvider.setCredentials(new AuthScope(OPCProperties
						.getInstance().getProperty(OPCProperties.OPC_BASE_URL),
						443), credOPCUser);
				httpClient = HttpClients.custom()
						.setDefaultCredentialsProvider(credsProvider).build();
			} else {
				httpClient = HttpClients.custom().build();
			}
					
			HttpPut httpPut = new HttpPut(sUri);
			
			for (BasicNameValuePair header: aHeaders)
			{
				httpPut.addHeader(header.getName(), header.getValue());
			}
			
			if (seBody != null) {
				httpPut.setEntity(seBody);
			}

			HttpResponse response = httpClient.execute(httpPut);
			
			if (response.getStatusLine().getStatusCode() != 202 
					&& (sUri.toLowerCase().contains("storage") && response.getStatusLine().getStatusCode() != 201) ) {
				System.out.println("FAILED. HTTP error code: " + response.getStatusLine().getStatusCode());
				System.out.println("Reason: " + response.getStatusLine().getReasonPhrase());
				return OPCProperties.HTTP_REQUEST_FAILED + ":" + response.getStatusLine().getStatusCode() 
						+ " Reason:" + response.getStatusLine().getReasonPhrase();
			}

			BufferedReader br = new BufferedReader(new InputStreamReader(
					(response.getEntity().getContent())));

			String sTemp;
			while ((sTemp = br.readLine()) != null) {
				sbOutput.append(sTemp).append("\n");
			}

			httpClient.close();

		} catch (IOException e) {
			e.printStackTrace();
			sbOutput = new StringBuffer(OPCProperties.HTTP_REQUEST_FAILED + ": IOException " + e.getMessage()); 
		}

		return sbOutput.toString();
	}


}
