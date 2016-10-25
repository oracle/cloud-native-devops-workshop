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
      <div>
              <br>SpringBoot application demo. Current server time: <%= new java.util.Date() %> <br>
              <h3>
                <span style="color: #333; text-decoration: none">About
                  Oracle Application Container Cloud</span>
              </h3>
              <div>
                <p>
                Oracle Application Container Cloud includes Oracle Java SE Cloud Service, which lets you deploy Java applications to the Oracle Cloud, and Oracle Node Cloud Service, which lets you deploy Node.js applications to the Oracle Cloud.
                <br>
                When you deploy your application you specify the kind of application, whether it's Node.js or Java. 
                You don't have to choose when you subscribe; both are available when you deploy. Your application runs in a Docker container.
                </p>
                <img max-width="100%" height="auto"
                  src="images/acc_architecture.png"><br> <a
                  href="https://docs.oracle.com/cloud/latest/apaas_gs/CSJSE/img_text/GUID-FFBF81E7-9FEC-4D6B-9FD5-175762F02108.htm"></a><br>
                <p>
                The key features of Oracle Application Container Cloud are:
                <ul>
                  <li>Pre-configured environment for Java and Node.js applications.</li>
                  <li>Java SE advanced features such as Java Flight Recorder, Java Mission Control, advanced memory management, and ongoing and timely security updates.</li>
                  <li>Open platform that supports all Java frameworks and containers such as Spring, Play, Tomcat, and Jersey.</li>
                  <li>You can also use Java Virtual Machine (JVM) based languages such as JRuby. Any language that uses the Java Virtual Machine can be run on this service.</li>
                  <li>Enterprise-grade support from Oracle.</li>
                </ul>
                </p>
                <p>
                  In addition, you can choose to integrate with other Oracle cloud services. You may develop your application on your local
                  system, or you can use Oracle Developer Cloud Service.
                <br>
                If you want to store and retrieve data, you may use Oracle Storage Cloud Service - a subscription is included. 
                You may also subscribe to Oracle Database Cloud Service.
                <br>
                For communication, you may subscribe to Oracle Messaging Cloud Service. Your application will communicate
                with that service via its REST API, so no special security configuration is necessary.
                </p>
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
