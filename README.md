![](images/customer.logo.png)
---
# ORACLE Cloud-Native DevOps workshop #

## Introduction ##

Oracle Cloud is the industry’s broadest and most integrated public cloud. It offers best-in-class services across software as a service (SaaS), platform as a service (PaaS), and infrastructure as a service (IaaS), and even lets you put Oracle Cloud in your own data center. Oracle Cloud helps organizations drive innovation and business transformation by increasing business agility, lowering costs, and reducing IT complexity. The workshop content shows different aspects of Application Development in the cloud with different set of Oracle Cloud Services.

### Prerequisites ###

Get the following account details ready to complete the tutorial and replace to your values when it is required:

+ Oracle Cloud account **username** and **password**
+ Oracle Cloud **identity domain**
+ **Data center/region**

NOTE: Before you start to use your new Oracle Public Cloud services make sure that the replication policy has been set for your account. Otherwise you can not create storage container which is necessary for most of the services. See [Selecting a Replication Policy for Oracle Storage Cloud Service](https://docs.oracle.com/cloud/latest/storagecs_common/CSSTO/GUID-5D53C11F-3D9E-43E4-8D1D-DDBB95DEC715.htm).

### Important ###

During the execution you will create several public cloud service instances what will be available on the world wide web. Even if these instances are for demo purposes keep in mind it is not a best practice to use weak or known (stored here in the tutorial) passwords especially in such open environment. Thus this workshop content does not recommend any password so you need to define those. You will be asked to provide password at certain points and please remember them  for  later usage. 

The content contains several independent modules that cover different aspects of the application development in the Oracle Cloud. These modules could be executed independently unless you find in the Prerequisites that they are dependendent on each other. 

----

####Run Lightweight Java container in the  Oracle Application Container Cloud Service####

+ [Deploy Tomcat sample application to Oracle Application Container Cloud](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/deploy.tomcat.on.accs.md)
+ [Scale up/down Application Container Service using user interface and PaaS Service Manager (PSM) Command Line Interface (CLI) tool](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/scale.up.down.accs.md)

####Deploy sample app to lightweight Java container and manage the application in Oracle Management Cloud####
+ Deploy App
+ Integrate with APM

####Support SpringBoot application development lifecycle using Oracle Developer Cloud Service, Application Container Cloud Service and Oracle Enterprise Pack For Eclipse####

+ [Create Oracle Developer Cloud Service project for SpringBoot application](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/create.devcs.project.springboot.md)
+ [Create continuous build integration using Oracle Developer Cloud Service and Oracle Application Container Cloud Service](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/devcs.accs.ci.md)
+ [Using Eclipse IDE (Oracle Enterprise Pack for Eclipse) with Oracle Developer Cloud Service](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/setup.oepe.md)

####Bind Frontend Application running on lightweight container in Oracle Appplication Container Cloud with backend resources running on Java Cloud Service####

+ [Implement new function (REST client) in SpringBoot sample application using Service Bindings to access Oracle Java Cloud Services](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/change.mgmt.devcs.md)

####Perform basic monitoring of application run inside Application Container Cloud thrugh diagnostic capabilities of Java Mission Control and Java Flight Recorder ####

+ [Monitor and tune SpringBoot application deployed on Oracle Application Container Cloud Service](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/monitor.application.deployed.accs.md)


#### Deploy Java EE application to Oracle Java Cloud Service####

+ [Create Database Cloud Service Instance using user interface](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/create.dbcs.ui.md)
+ [Create Java Cloud Service Instance using user interface](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/create.jcs.ui.md)
+ [Prepare Database Cloud Service Instance to store sample application's data](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/prepare.dbcs.md)
+ [Deploy Java EE sample application to Oracle Java Cloud Service using Admin console](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/deploy.to.jcs.md)

####Manage Oracle Java Cloud Service using UI and PaaS Service Manager####

+ [Direct access and management of Oracle Java Cloud Service](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/view.jcs.log.using.ssh.md)
+ [Scale-Out Oracle Java Cloud Service using user interface](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/jcs.scale.md)
+ [Scale-In Oracle Java Cloud Service using PaaS Service Manager (PSM) Command Line Interface (CLI)](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/psm.cli.md)

####Making Java Cloud Service elasticly sclable through Policy based Auto-scaling####
+ policy based auto scaling content



####Upgrade WebLogic Server 11g (10.3.6) running on premise to 12cR2 with Multitenancy and migrate to Java Cloud Service####

+ [Introduction and prerequisites](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/lift.andshift.intro.and.prereq.md) 
+ [Convert WebLogic 11g domain into the 12cR2 partition using DPCT (Domain to Partition Conversion Tool)](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/HOL7606/dpct.11g.12R2.migration.md)
+ [Move partition from WebLogic Server 12cR2 to Oracle Java Cloud Service](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/HOL7606/lift.and.shift.md)

####Migrate Weblogic 10.3.6 (on premise) Application to Java Cloud Service with App2Cloud tool ####

+ [Migrate Weblogic 10.3.6 (on premise) Application to Java Cloud Service with App2Cloud tool](https://github.com/oracle-weblogic/weblogic-innovation-seminars/tree/caf-12.2.1/cloud.demos/app.2.cloud)
 
####Clean up the environment####

+ [Delete Java Cloud, Database Cloud and Database Container Services using user interface](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/cleanup.md)
+ [Delete Application Cloud Container Service using PaaS Service Manager (PSM) Command Line Interface (CLI)](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/jcs.basics/cleanup.psm.md)
+ Delete storage container using REST API management interface
