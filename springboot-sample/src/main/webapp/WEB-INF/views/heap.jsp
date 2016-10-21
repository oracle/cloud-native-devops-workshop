<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
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
		int totalHeapInUse = 0;
		if (request.getParameter("totalHeapInUse") != null) {
			totalHeapInUse = Integer.parseInt(request.getParameter("totalHeapInUse"));
		}

		if (request.getParameter("allocateHeap") != null) {
			int allocateHeap = Integer.parseInt(request.getParameter("allocateHeap"));
			LinkedList<byte[]> byteArrayLinkedList = null;
			if (session.getAttribute("ByteArrayLinkedList") != null) {
				byteArrayLinkedList = (LinkedList<byte[]>) session.getAttribute("ByteArrayLinkedList");
			} else {
				byteArrayLinkedList = new LinkedList<byte[]>();
			}
			if (allocateHeap > 0) {
				for (int i = 0; i < allocateHeap * 10; i++) {
					byteArrayLinkedList.add(new byte[100 * 1024]);
					try {
						Thread.sleep(1);
					} catch (Exception ex) {
						// ignore;
					}
				}
				totalHeapInUse += allocateHeap;
			} else {
				for (int i = allocateHeap * 10; i < 0; i++) {
					byteArrayLinkedList.remove(0);
					try {
						Thread.sleep(1);
					} catch (Exception ex) {
						// ignore;
					}
				}
				totalHeapInUse += allocateHeap;
			}
			session.setAttribute("ByteArrayLinkedList", byteArrayLinkedList);
		}
    							%>

								<table border="0">
									<tr>
										<td height="3">&nbsp;</td>
									</tr>
									<tr>
										<td><font face="Arial, Helvetica, sans-serif;" size="4px">
												Total Heap in Use = <%= totalHeapInUse %> MB
										</font></td>
									</tr>
									<tr>
										<td height="3">&nbsp;</td>
									</tr>
									<tr>
										<td>Allocate Heap : <input type="text"
											name="allocateHeap" style="height: 50px; width: 100px;" /> MB
											&nbsp;&nbsp;&nbsp;&nbsp; <input type="submit" value="Submit"
											style="height: 50px; width: 100px" />
										</td>
									</tr>
									<tr>
										<td height="3">&nbsp;</td>
									</tr>
									<tr>
										<td><input type="hidden" name="totalHeapInUse"
											value="<%= totalHeapInUse %>"></td>
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
