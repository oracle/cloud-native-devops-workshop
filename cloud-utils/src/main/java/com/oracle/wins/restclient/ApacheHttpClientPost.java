package com.oracle.wins.restclient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.oracle.wins.util.OPCProperties;

public class ApacheHttpClientPost {

	public static String httpClientPOST(String sUsername, String sPassword,
			String sRestUrl, String sIdentityDomain, String sInstance,
			String sBaseUrl, String sContentType, StringEntity seBody) {
		
		StringBuffer sbOutput = new StringBuffer();
		
		try {

			CredentialsProvider credsProvider = new BasicCredentialsProvider();
			credsProvider.setCredentials(new AuthScope(sBaseUrl, 443),
					new UsernamePasswordCredentials(sUsername, sPassword));

			CloseableHttpClient httpClient = HttpClients.custom()
					.setDefaultCredentialsProvider(credsProvider).build();

			System.out.println("https://" + sBaseUrl + sRestUrl
					+ sIdentityDomain);

			HttpPost httpPost = new HttpPost("https://" + sBaseUrl + sRestUrl
					+ sIdentityDomain);

			httpPost.addHeader("accept", "application/json");
			httpPost.addHeader("X-ID-TENANT-NAME", sIdentityDomain);
			httpPost.addHeader("Content-Type", sContentType);

			httpPost.setEntity(seBody);

			HttpResponse response = httpClient.execute(httpPost);
			
			System.out.println("Response code: " + response.getStatusLine().getStatusCode());

			if (response.getStatusLine().getStatusCode() != 202) {
				System.out.println("FAILED. HTTP error code: " + response.getStatusLine().getStatusCode());
				System.out.println("Reason: " + response.getStatusLine().getReasonPhrase());
				response.getEntity().writeTo(System.out);
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
