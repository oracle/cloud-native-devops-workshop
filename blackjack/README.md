# How to Prepare for the BlackJack Hands-On-Lab

In this hands-on lab, you will build and deploy a blackjack RESTful
Cloud Application to Oracle Application Container Cloud Service, using
Oracle Developer Cloud Service. The sample application is a blackjack
REST service with an HTML5 client. You will start by building a simple
Helloworld application using Git and Maven locally and push the
application to Oracle Developer Cloud Service. Next, you will deploy the
application to Oracle Application Container Cloud Service.

The result is you will learn to take an application developed locally
and deploy it to Oracle Cloud.

You use your laptop and your Oracle Cloud trial account to perform the lab and run the blackjack card game.

## First, Get an Oracle Cloud Account

-   Prior to arriving at the event, please obtain access to your own Trial account. Trial accounts can be obtained at [Try
    It](http://cloud.oracle.com/tryit)

## Second, Configure your Client Environment

1. Your computer’s environment must be configured prior to attempting the Hands-on-labs.

Please follow the instruction in the linked documents [Windows](http://www.oracle.com/webfolder/technetwork/tutorials/OracleCode/Windows-HOL-setup.pdf) or [Mac](http://www.oracle.com/webfolder/technetwork/tutorials/OracleCode/Mac-HOL-setup.pdf) of the Lab Guides prior to attempting the Labs.

2. Download the following files from GitHub (they are in the list on [this page](https://github.com/oracle/cloud-native-devops-workshop/tree/master/blackjack))
-   Blackjack.zip
-   Helloworld-Example.zip
-   pom.xml

## How to View the Lab Guides

-   Download the [blackjack.zip](BlackJack.zip) file.
-   To log issues and view the Lab Guide source, go to the [oracle git repository](https://github.com/oracle/cloud-native-devops-workshop).

**Reference the following Lab Guides by opening the lab guides:**

- PART I: Local Development Environment Setup [Windows](1-local-windows-setup.md) or [Mac](1-local-mac-setup.md)
- [PART II : Test and Build Helloworld App on Oracle Developer Cloud](2-developer-cloud-hello-world.md)
- [PART III: Test, Build and Deploy the BlackJack Web Service App](3-developer-cloud-blackjack.md)
- [PART IV: Deploy the BlackJack WebService App Directly to Oracle Application Container Cloud](4-acc-deploy.md)

## Lab Summary

### PART I: Local Development Environment Setup

Instructions for [Windows](1-local-windows-setup.md) or [Mac](1-local-mac-setup.md).

You must download and create a local development environment on your
personal device to setup a Git and Maven environment so that you can
clone your application to Developer Cloud Service.  
1. Download Netbeans or your favorite IDE  
2. Git  
3. Maven  
4. JDK 8

#### Objectives:

1. Download the [blackjack.zip](BlackJack.zip) Java WebApp source files
2. Create a local Git Repository
3. Create a local Helloworld project using Maven
4. Push the Helloworld project to the local Git Repository

### [PART II : Test and Build Helloworld App on Oracle Developer Cloud](2-developer-cloud-hello-world.md)

Set up a Helloworld Project on Oracle Cloud

#### Objectives:

1.  Set up a replication policy
2.  Activate Developer Cloud Service
3.  Create a Helloworld Project
4.  Create a GIT repository in Developer Cloud Service
5.  Clone your local GIT repository
6.  Build the application

### [PART III: Test, Build and Deploy the BlackJack Web Service App](3-developer-cloud-blackjack.md)

#### Objectives:

1.  Test the BlackJack app on your local development environment
2.  Create a BlackJack Project on Developer Cloud Service
3.  Create a GIT Repository in Developer Cloud Service
4.  Clone your local GIT repository
5.  Build the BlackJack application using Developer Cloud Service
6.  Deploy the BlackJack application to Application Container Cloud

### [PART IV: Deploy the BlackJack WebService App Directly to Oracle Application Container Cloud](4-acc-deploy.md)

#### Objectives:

1.  Activate Oracle Application Container Cloud Service (OACCS)
2.  Deploy the BlackJack Application directly to OACCS
3.  Test the BlackJack Application Deployed on OACCS
