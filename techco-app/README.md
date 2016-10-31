![](../common/images/customer.logo.png)
---
# ORACLE Cloud-Native DevOps workshop #
-----
## Deploy TechCo Demo application to Oracle Java Cloud Service ##

### Introduction ###

This section describes preparing Oracle Database Cloud Service and deploying TechCo Demo application to an Oracle Java Cloud Service instance by using the WLST script.

### About this tutorial ###

This tutorial is a shortcut to quickly deploy TechCo sample application using a single script which 

+ creates user and tables on Oracle Database Cloud Service
+ creates resources on Oracle Java Cloud Service
+ deploys demo application to OracleJava Cloud Service.

### Prerequisites ###

+ This lab requires to build the model of on-premise environment. See [Preparation of the on-premise environment](../common/vbox.vm.md)
+ [Running Database Cloud Service](../dbcs-create/README.md) instance to prepare for TechCo Demo application.
+ [Running Java Cloud Service](../jcs-create/README.md) instance to deploy TechCo Demo application.

### Steps ###

#### Add SSH private key's passphrase to SSH-Agent ####

To avoid providing SSH private key's passphrase multiple time during script execution you need to register your private key and passphrase in SSH-Agent running on your desktop (VirtualBox image). Open a terminal and change to `GIT_REPO_LOCAL_CLONE/cloud-utils` folder. Then add your private key's passphrase to SSH-Agent. Your default private key file's name is `pk.openssh`. If not define the proper private key's file name:

    $ [oracle@localhost Desktop]$ cd /GIT_REPO_LOCAL_CLONE/cloud-utils
    $ [oracle@localhost cloud-utils]$ ssh-add pk.openssh

The SSH-Agent will ask the passphrase if the private key has. In case you generated public and private key using *cloud-utils* then you can check for passphrase the `ssh.passphrase` property's value in the `environment.properties` file. Type the passphrase:

	Enter passphrase for pk.openssh: 
	Identity added: pk.openssh (pk.openssh)
	[oracle@localhost cloud.demos]$ 

Now the identity has been added so no need to provide the passphrase in the future during `ssh` or `scp` execution.

#### Deploy TechCo Demo application ####

The Database Cloud Service, Java Cloud Service preparation and application deployment can be completed executing a single script. Change the directory to `GIT_REPO_LOCAL_CLONE/techco-app` folder and invoke 'deployTechCo.sh' script:

    $ [oracle@localhost Desktop]$ cd /u01/content/cloud-native-devops-workshop/techco-app
    $ [oracle@localhost techco-app]$ ./deployTechCo.sh    
	../cloud-utils/environment.properties found.
	Identity domain: paasdemoXX
	Java Cloud Service Public IP address: 129.144.18.102
	Database Cloud Service Public IP address: 129.144.18.253
	[INFO] Scanning for projects...
	[INFO]                                                                         
	[INFO] ------------------------------------------------------------------------
	[INFO] Building TechCo-ECommerce 1.0-SNAPSHOT
	[INFO] ------------------------------------------------------------------------
    ...
    ...
    ...
    SQL> 
	1 row created.
	
	SQL> 
	1 row created.
	
	SQL> SQL> 
	Commit complete.
	
	SQL> Disconnected from Oracle Database 12c Enterprise Edition Release 12.1.0.2.0 - 64bit Production
	Database Cloud Service has been prepared.
		
	Initializing WebLogic Scripting Tool (WLST) ...
		
	Welcome to WebLogic Server Administration Scripting Shell
		
	Type help() for help on available commands
		
	Connecting to t3://winsdemoWLS-wls-1.compute-paasdemo16.oraclecloud.internal:7001 with userid weblogic ...
	
	Successfully connected to Admin Server "winsdemo_adminserver" that belongs to domain "winsdemoWLS_domain".
		
	Warning: An insecure protocol was used to connect to the server. 
	To ensure on-the-wire security, the SSL port or Admin port should be used instead.
	
	Location changed to edit tree. 	 
	This is a writable tree with DomainMBean as the root. 	 
	To make changes you will need to start an edit session via startEdit(). 
	For more help, use help('edit').
		
	Starting an edit session ...
	Started edit session, be sure to save and activate your changes once you are done.
	Activating all your changes, this may take a while ... 
	The edit lock associated with this edit session is released once the activation is completed.
	Activation completed
	Deploying application from /tmp/TechCo-ECommerce-1.0-SNAPSHOT.war to targets winsdemoWLS_cluster (upload=false) ...
	<Sep 14, 2016 10:25:09 PM UTC> <Info> <J2EE Deployment SPI> <BEA-260121> <Initiating deploy operation for application, TechCo-ECommerce-1.0-SNAPSHOT [archive: /tmp/TechCo-ECommerce-1.0-SNAPSHOT.war], to winsdemoWLS_cluster .> 
	..Completed the deployment of Application with status completed
	Current Status of your Deployment:
	Deployment command type: deploy
	Deployment State : completed
	Deployment Message : no message
	Starting application TechCo-ECommerce-1.0-SNAPSHOT.
	<Sep 14, 2016 10:25:18 PM UTC> <Info> <J2EE Deployment SPI> <BEA-260121> <Initiating start operation for application, TechCo-ECommerce-1.0-SNAPSHOT [archive: null], to winsdemoWLS_cluster .> 
	.Completed the start of Application with status completed
	Current Status of your Deployment:
	Deployment command type: start
	Deployment State : completed
	Deployment Message : no message
	No stack trace available.
	
	Exiting WebLogic Scripting Tool.
	
	<Sep 14, 2016 10:25:22 PM UTC> <Warning> <JNDI> <BEA-050001> <WLContext.close() was called in a different thread than the one in which it was created.> 
	TechCo application has been deployed.
    [oracle@localhost techco-app]$

You should see at the end the successful deployment message.

#### Launch sample application ####

To test an application that you have deployed and started on an Oracle Java Cloud Service instance that does not include a load balancer requires public IP address of the compute node.

The public IP address of the allocated Oracle Java Cloud Service was provided by the instructor.

Optionally you may  query Oracle Cloud through REST API about the JCS public IP using the maven based tool available on your desktop (VirtualBox image). Open a terminal and change to the `GIT_REPO_LOCAL_CLONE/cloud-utils/` folder. Then execute the following command:

	$ [oracle@localhost Desktop]$ cd /u01/content/cloud-native-devops-workshop/cloud-utils
    $ [oracle@localhost cloud-utils]$ mvn -Dgoal=jcs-get-ip
	[INFO] Scanning for projects...
	[INFO] ------------------------------------------------------------------------
	[INFO] Reactor Build Order:
	[INFO] 
	[INFO] wins-cloud
	[INFO] cloud-api
	[INFO]                                                                         
	[INFO] ------------------------------------------------------------------------
	[INFO] Building wins-cloud 1.0.0-SNAPSHOT
	[INFO] ------------------------------------------------------------------------
	[INFO] 
	[INFO] --- maven-install-plugin:2.4:install (default-install) @ wins-cloud ---
	[INFO] Installing /u01/content/cloud-native-devops-workshop/cloud-utils/pom.xml to /home/oracle/.m2/repository/com/oracle/wins/cloud/wins-cloud/1.0.0-SNAPSHOT/wins-cloud-1.0.0-SNAPSHOT.pom
	[INFO]                                                                         
	[INFO] ------------------------------------------------------------------------
	[INFO] Building cloud-api 1.0.0-SNAPSHOT
	[INFO] ------------------------------------------------------------------------
	[INFO] 
	[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ cloud-common ---
	[INFO] Using 'UTF-8' encoding to copy filtered resources.
	[INFO] skip non existing resourceDirectory /u01/content/cloud-native-devops-workshop/cloud-utils/src/main/resources
	[INFO] 
	[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ cloud-common ---
	[INFO] Nothing to compile - all classes are up to date
	[INFO] 
	[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ cloud-common ---
	[INFO] Using 'UTF-8' encoding to copy filtered resources.
	[INFO] skip non existing resourceDirectory /u01/content/cloud-native-devops-workshop/cloud-utils/src/test/resources
	[INFO] 
	[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ cloud-common ---
	[INFO] Nothing to compile - all classes are up to date
	[INFO] 
	[INFO] --- maven-surefire-plugin:2.12.4:test (default-test) @ cloud-common ---
	[INFO] Tests are skipped.
	[INFO] 
	[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ cloud-common ---
	[INFO] 
	[INFO] --- maven-install-plugin:2.4:install (default-install) @ cloud-common ---
	[INFO] Installing /u01/content/cloud-native-devops-workshop/cloud-utils/target/cloud-common.jar to /home/oracle/.m2/repository/com/oracle/wins/cloud/cloud-common/1.0.0-SNAPSHOT/cloud-common-1.0.0-SNAPSHOT.jar
	[INFO] Installing /u01/content/cloud-native-devops-workshop/cloud-utils/pom.xml to /home/oracle/.m2/repository/com/oracle/wins/cloud/cloud-common/1.0.0-SNAPSHOT/cloud-common-1.0.0-SNAPSHOT.pom
	[INFO] 
	[INFO] --- maven-antrun-plugin:1.8:run (first) @ cloud-common ---
	[INFO] Executing tasks
	
	main:
	     [java] Read all properties from: file:/u01/content/cloud-native-devops-workshop/cloud-utils/environment.properties
	     [java] Selected goal: jcs-get-ip
	     [java] JCS get public IP address----------------------------------------
	     [java] Executing request GET http://jaas.oraclecloud.com/paas/service/jcs/api/v1.1/instances/paasdemo16/winsdemoWLS HTTP/1.1 Auth: {<any realm>@jaas.oraclecloud.com:443=[principal: demouser]}
	     [java] Response: HTTP/1.1 200 OK
	     [java] Public IP address of the JCS instance: 129.144.18.102
	[INFO] Executed tasks
	[INFO] ------------------------------------------------------------------------
	[INFO] Reactor Summary:
	[INFO] 
	[INFO] wins-cloud ......................................... SUCCESS [  0.614 s]
	[INFO] cloud-api .......................................... SUCCESS [  6.488 s]
	[INFO] ------------------------------------------------------------------------
	[INFO] BUILD SUCCESS
	[INFO] ------------------------------------------------------------------------
	[INFO] Total time: 7.379 s
	[INFO] Finished at: 2016-09-14T15:42:49-07:00
	[INFO] Final Memory: 12M/491M
	[INFO] ------------------------------------------------------------------------
	[oracle@localhost cloud-utils]$ 


Please open a browser and write the following URL using your Oracle Java Cloud Service (JCS) IP address: `https://<jcs-public-ip-address>/TechCo-ECommerce`
You should now see the home page of the sample application.

![](../jcs-deploy/images/28.png)

If your Java Cloud Service has Load Balancer configured then use its public IP address to access the TechCo Demo application.