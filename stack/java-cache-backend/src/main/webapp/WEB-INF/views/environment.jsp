<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@page import="java.util.TreeMap"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@page import="java.lang.management.ManagementFactory"%>
<%@page import="java.lang.management.RuntimeMXBean"%>
<%@page import="java.lang.ClassLoader"%>
<%@ page import="org.slf4j.Logger"%>
<%@ page import="org.slf4j.LoggerFactory"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<style>
table {
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

td, th {
	border: 1px solid #dddddd;
	text-align: left;
	padding: 8px;
}

tr:nth-child(even) {
	background-color: #dddddd;
}
</style>
<link rel="stylesheet"
	href="//cdn.rawgit.com/yahoo/pure-release/v0.6.2/pure-min.css">
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Application Container Cloud Service - Environment
	Variables</title>
</head>
<body>

	<h1>
		Welcome to <a href="https://cloud.oracle.com/acc" target="_blank"><font
			color="red">Oracle Application Container Cloud Service Demo</font></a>
	</h1>
	<p>
		This is a JavaSE back-end service for <a
			href="http://www.oracle.com/webfolder/technetwork/jet/globalExamples-App-FixItFast.html"
			target="_blank">Oracle JET FixItFast demo</a> application using <a
			href="http://docs.oracle.com/en/cloud/paas/app-container-cloud/cache/typical-workflow-creating-and-using-caches.html"
			target="_blank">Caches in Oracle Application Container Cloud
			Service</a>
	</p>

	Links to test services:
	<br>
	<a href="/customerlist">Edit Customers</a>
	<br>
	<a href="customers">Customers - REST Service</a>
	<br>
	<a href="/locations">Locations - REST Service</a>
	<br>
	<h3>Environment Variables for current Application Container Cloud
		Service</h3>
	<table class="pure-table pure-table-bordered">
		<tr>
			<th>Name</th>
			<th>Value</th>
		</tr>
		<%
			Logger logger = LoggerFactory.getLogger(this.getClass());
			TreeMap<String, String> sortedMap = new TreeMap<String, String>();
			sortedMap.putAll(System.getenv());
			for (Map.Entry<String, String> f : sortedMap.entrySet()) {
				out.println("<tr><td><b>");
				out.println(f.getKey());
				out.println("</b></td><td>");
				out.println(f.getValue());
				out.println("</td></tr>");
			}
			RuntimeMXBean runtimeMxBean = ManagementFactory.getRuntimeMXBean();
			List<String> arguments = runtimeMxBean.getInputArguments();
			String sJavaagentArg = "-javaagent option was not defined.";
			for (String argument : arguments) {
				if (argument.startsWith("-javaagent:")) {
					sJavaagentArg = argument;
					break;
				}
			}
			out.println("<tr><td><b>Java Agent</b> (RuntimeMXBean)</td><td>" + sJavaagentArg + "</td></tr>");
			try {
				java.lang.reflect.Method m = ClassLoader.class.getDeclaredMethod("findLoadedClass",
						new Class[] { String.class });
				m.setAccessible(true);
				ClassLoader cl = ClassLoader.getSystemClassLoader();
				Object oAgent = m.invoke(cl, "oracle.apmaas.agent.instrumentation.Agent");
				out.println("<tr><td><b>oracle.apmaas.agent.instrumentation.Agent</b></td><td>Agent is "
						+ (oAgent != null ? "" : "not") + " loaded.</td></tr>");
			} catch (Exception e) {
				logger.error("Searching APM Agent class failed", e);
			}
		%>

	</table>

	<br>
	<a href="applog">Spring Boot application log</a>
	<br>
	<a href="agentlog">APM agent log (if deployed)</a>
</body>
</html>