<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@ page import="java.text.SimpleDateFormat"%>

<%!private class LoadRunner implements Runnable {

		String sLoadFactor;
		long lTimeToRunInMillisec;

		public LoadRunner(long time, String factor) {
			lTimeToRunInMillisec = time;
			sLoadFactor = factor;
		}

		public void run() {

			long lListSize = 100000;
			long lStartTime = System.currentTimeMillis();

			if (sLoadFactor.equals("low")) {
				lListSize = 10000;
			} else if (sLoadFactor.equals("mid")) {
				lListSize = 100000;
			} else if (sLoadFactor.equals("high")) {
				lListSize = 1000000;
			}

			System.out.println("Load Time ====================== " + lTimeToRunInMillisec);
			System.out.println("Load Factor ==================== " + sLoadFactor);
			

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Calendar calendar = Calendar.getInstance();

			System.out.println(sdf.format(calendar.getTime()) + " - " + Thread.currentThread().getName()
					+ " started. Time to run: " + lTimeToRunInMillisec + " ms");
			ArrayList<String> list = new ArrayList<String>();

			for (long i = 0; i < lListSize; i++) {
				list.add(UUID.randomUUID().toString() + UUID.randomUUID().toString() + UUID.randomUUID().toString());
			}

			do {
				Collections.shuffle(list);
				Collections.sort(list);
				if (System.currentTimeMillis() - lStartTime > lTimeToRunInMillisec) {
					break;
				}
				long lLeftTime = lTimeToRunInMillisec - (System.currentTimeMillis() - lStartTime);
				calendar.setTimeInMillis(System.currentTimeMillis());
				System.out.println(sdf.format(calendar.getTime()) + " - " + Thread.currentThread().getName()
						+ " running. Time to run: " + lLeftTime + " ms");
			} while (true);

			System.out.println("CPULoadRunnable completed.");

		}

	}%>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<style type="text/css">
</style>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" href="css/cloud3.css">

<title>Oracle Java SE Cloud Service - Runtime Environment
	Details</title>

</head>
<body>
	<header class="navbar-fixed-top">
		<hgroup class="container">
			<div class="cloudLogo columns">
				<a href='http://cloud.oracle.com' target="_blank"><img
					alt="Oracle Cloud logo" src="images/oracle-cloud-logo.png"
					border="0" /></a>
			</div>

		</hgroup>
	</header>


	<div class="blueBanner">
		<div class="container">

			<div class="blueBannerLogo img-center-align">
				<img src='images/accs.png' alt="" />
			</div>

			<div class="blueBannerHeading">
				<h1 class="blueBannerTitleWithSubtitle">
					<a href="http://docs.oracle.com/cloud/latest/apaas_gs/index.html"
						target="_blank" style="color: #ffffff">Oracle Application
						Container Cloud Service</a>
				</h1>
				<h2 class="blueBannerSubTitle">Easy, rapid and agile deployment
					of Java SE, Node.js or PHP application.</h2>
				<h2 class="blueBannerSubTitle">Experience full control and
					flexibility of your application in public cloud.</h2>
			</div>

			<div class="blueBannerButton"></div>
		</div>
	</div>



	<div class="container serviceContainer" style="margin-top: 150px;">
		<div class="overviewLayout">
			<div class="whyOracleVideoSection">
				<div class='overviewDemoSection'>
					<div class="whyOracleListing">
						<div class="whyOracleListingLayout">
							<form method="post">
		<%
			int iThreadNum = 5;
			long lTimeToRunInMillisec =  100000;
			String sLoadFactor = "mid";
			if ("POST".equalsIgnoreCase(request.getMethod()) && request.getParameter("submit") != null) {

				if (request.getParameter("runCPULoadTime") != null) {
					lTimeToRunInMillisec = Long.parseLong(request.getParameter("runCPULoadTime"));
				}

				if (request.getParameter("loadfactor") != null) {
					sLoadFactor = request.getParameter("loadfactor");
				}
				
				LoadRunner load = new LoadRunner(lTimeToRunInMillisec, sLoadFactor);
				for (int i = 0; i < iThreadNum; i++) {
					Thread thread = new Thread(null, load, "CPULOAD_" + i);
					thread.start();
					Thread.sleep(1000);
				}
			}
		%>

								<table border="0">
									<tr>
										<td height="3">&nbsp;</td>
									</tr>
									<tr>
										<td>
										Run 
										<select id="loadfactor" name="loadfactor">
										  <option value="low">Low</option>
										  <option value="mid">Mid</option>
										  <option value="high">High</option>
										</select>
										CPU load for : <input type="text" name="runCPULoadTime" style="width: 100px" /> ms
											&nbsp;&nbsp;&nbsp;&nbsp; 
											<input type="submit" name="submit" value="Submit" />
										</td>
									</tr>
									<tr>
										<td height="3">&nbsp;</td>
									</tr>


								</table>
							</form>

						</div>
					</div>
					<div class="videoShadow"></div>
				</div>


			</div>
		</div>



	</div>


	<footer>
		<div class="opcGlobalFooter">
			<div class="container">
				<div class="footerLeft columns">
					<ul>
						<li><a href='http://www.oracle.com/corporate/index.html'
							target="_blank">About Oracle</a></li>
						<li><a
							href='http://www.oracle.com/corporate/contact/index.htm'
							target="_blank">Contact Us</a></li>
						<li><a href='http://www.oracle.com/us/legal/index.html'
							target="_blank">Legal Notices</a></li>
						<li><a href='http://www.oracle.com/us/legal/terms/index.html'
							target="_blank">Terms of Use</a></li>
						<li><a
							href='http://www.oracle.com/us/legal/privacy/index.html'
							target="_blank">Your Privacy Rights</a></li>
					</ul>



					<p>Copyright &copy; 2013, 2014 Oracle and/or its affiliates.
						All rights reserved.</p>

				</div>

			</div>
		</div>
	</footer>
</body>
</html>
