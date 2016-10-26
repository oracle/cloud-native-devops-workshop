## On premise environment needed for some of the labs ##

There are two options how you can prepare that environment:

+ By importing distributed by Oracle Virtual Box image. Contact your local oracle representative or Maciej.Gruszka@oracle.com
+ By creation your own nevironment

#### How to create own environment ###
You need to install the following software:

Software | Expected path | Remarks
--- | --- | ---
JDK7 | /usr/java/jdk1.7.0_XX/ | We used JDK7u79 so the path in the VBox was /usr/java/jdk1.7.0_79/
JDK8 | /usr/java/jdk1.8.0_XX/ | We used JDK8u60 so the path in the VBox was /usr/java/jdk1.8.0_60/
Maven |  | 
Lab content for Lift and Shift | /u01/content/weblogic-innovation-seminars/WInS_Demos/MT-Workshop/Lab8 | Extracted based on the content at https://github.com/oracle-weblogic/weblogic-innovation-seminars/tree/caf-12.2.1/WInS_Demos/MT-Workshop/Lab8
cloud.demos utility content | /u01/content/weblogic-innovation-seminars/cloud.demos | Extracted based on the content at https://github.com/oracle-weblogic/weblogic-innovation-seminars/tree/caf-12.2.1/cloud.demos
Weblogic Server 10.3.6 | /u01/wins/wls1036/ | We used WLS 10.3.6.0.0
WebLogic Server 12.2.1 | /u01/wins/wls1221/ | We used WLS 12.2.1.0.0
Domain To Partition  Conversion Tool | /u01/dpct |
Oracle DataBase 12c | /u01/app/oracle/product/12.1.0/dbhome_1/ | 

#### Modifying environment.properties file ###
To operate all scripts agains your own Oracle Public Cloud environment you need to set up file environment.properties in the /u01/content/weblogic-innovation-seminars/cloud.demos folder.
We have prepared two samples environment.properties.us2 and environment.properties.emea2 that you could customize and copy to environment.properties file.

The table below describes the meaning of viariables stored in that file

TBD - table with veriables

If your OPC account is just fresh created account - no storage, no DBCS instance, no JCS instance - then modify in the environment.properties only three variables:
+ opc.identity.domain
+ opc.username
+ opc.password

and execute the following scripts:

    $ [oracle@localhost Desktop]$ cd /u01/content/weblogic-innovation-seminars/cloud.demos
    $ [oracle@localhost cloud.demos]$ mvn install -Dgoal=generate-ssh-keypair
      (...) 
    $ [oracle@localhost cloud.demos]$ mvn install -Dgoal=jcs-create-auto
      (...)

It would create for you all needed instances on JCS and DBCS


