package com.oracle.cloud.demo.oe.web.util.env;

public class EnvironmentInformation {
	public static void main(String args[]) {

		System.out.println("");

		System.out
				.println("[INFO] ------------------------------------------------------------------------");
		System.out.println("[INFO] Getting DevCS Environment Information");
		System.out
				.println("[INFO] ------------------------------------------------------------------------");
		System.out.println("");

		String proxyHost = "";
		String proxyPort = "";
		String s = System.getenv("HTTP_PROXY");
		if (s != null) {
			proxyHost = s.substring(s.indexOf("//") + 2,
					s.indexOf(":", s.indexOf(":") + 1));
			proxyPort = s.substring(s.indexOf(":", s.indexOf(":") + 1) + 1,
					s.length());

		}
		System.out.println("[INFO] HTTP Proxy Host= "+ proxyHost);
		System.out.println("[INFO] HTTP Proxy Port= "+ proxyPort);
		System.out.println("[INFO] HTTPS Proxy Host= "+proxyHost);
		System.out.println("[INFO] HTTPS Proxy Port= "+ proxyPort);
	}

}
