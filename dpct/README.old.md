# Oracle OpenWorld 2016 #

# #7606 - Hands On Tutorial #
----

### Introduction ###

#### Domain to Partition Conversion tool ####
The Domain to Partition Conversion Tool (DPCT) provides a utility that inspects a specified source domain and produces an archive containing the resources, deployed applications and other settings.  This can then be used with the Import Partition operation provided in WebLogic Server 12.2.1 to create a new partition that represents the original source domain.  An external overrides file is generated (in JSON format) that can be modified to adjust the targets and names used for the relevant artifacts when they are created in the partition. DPCT supports WebLogic Server 10.3.6, 12.1.1, 12.1.2 and 12.1.3 source domains and makes the conversion to WebLogic Server 12.2.1 partitions a straightforward process.

#### Lift and shift ####
During our labs we show how to move existing domain partition running in On-Premise WebLogic Server by export and import capabilities to WebLogic Server running inside Java Cloud Service. We prepared single maven command that copy domain partition files in to Java Cloud Service VM as well as copy and execute all SQL files on DataBase Cloud Service environment to create working environment for our lab. In this HOL we keep domain and database configuration simple.

----

### Prerequisites ###

Get the following details ready to complete the tutorial:

+ Oracle Cloud **identity domain** - Instructor provides the details.
+ Oracle Cloud account **username** and **password** - Instructor provides the details.
+ IP addresses of Database Cloud Service (**DBCS IP**) and Java Cloud Service (**JCS IP**) - Instructor provides the details.


#### Prepare your desktop to access the assigned cloud enviroment ###
Open a terminal and copy the file `/u01/content/weblogic-innovation-seminars/cloud.demos/environment.properties.DOMAINID` (where DOMAINID phrase needs to be replaced with Oracle Cloud **identity domain** distributed by the Instructor) into the file `/u01/content/weblogic-innovation-seminars/cloud.demos/environment.properties` 

    $ [oracle@localhost Desktop]$ cd /u01/content/weblogic-innovation-seminars/cloud.demos
    $ [oracle@localhost cloud.demos]$ cp environment.properties.DOMAINID environment.properties

----

###Moving Oracle WebLogic Server 11g to the Cloud with Oracle WebLogic Server Multitenancy###

1. [Convert WebLogic 11g domain into the 12cR2 partition using DPCT (Domain to Partition Conversion Tool)](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/HOL7606/dpct.11g.12R2.migration.md)
2. [Move partition from WebLogic Server 12cR2 to Oracle Java Cloud Service](https://github.com/oracle-weblogic/weblogic-innovation-seminars/blob/caf-12.2.1/cloud.demos/HOL7606/lift.and.shift.md)
