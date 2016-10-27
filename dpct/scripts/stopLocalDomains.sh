#!/bin/bash

export JAVA_HOME=/usr/java/jdk1.7.0_79/
export MW_HOME=/u01/wins/wls1036/

echo "********** STOPPING ADMIN SERVER (WEBLOGIC 10.3.6 - DOMAIN1036) *******************"
cd /u01/wins/wls1036/user_projects/domains/Domain1036/bin
nohup ./stopWebLogic.sh &>stop.log

export JAVA_HOME=/usr/java/latest/
export MW_HOME=/u01/wins/wls1221/

echo "********** STOPPING ADMIN SERVER (WEBLOGIC 12.2.1 - DOMAIN1221) *******************"
cd /u01/wins/wls1221/user_projects/domains/Domain1221/bin
nohup ./stopWebLogic.sh &>stop.log



