#!/bin/sh

# Source global definitions
if [ -f /etc/bashrc ]; then
  . /etc/bashrc
fi

# User specific aliases and functions

export CONFIG_JVM_ARGS=-Djava.security.egd=file:/dev/./urandom
export JAVA_OPTIONS=$CONFIG_JVM_ARGS

export SW_BASE="/u01"
export USER_BASE="/u01"

##################################################################

export ORACLE_HOME=/u01/app/oracle/product/12.1.0/dbhome_1
export ORACLE_SID=orcl
export PATH=$ORACLE_HOME/bin:$PATH

##################################################################

export CONTENT_HOME="${USER_BASE}/content"
export DEMOS_HOME="${CONTENT_HOME}/weblogic-innovation-seminars/WInS_Demos"
export MW_HOME="/u01/wins/wls1221"
export USER_PROJECTS="${MW_HOME}/user_projects"
export DOMAINS="${USER_PROJECTS}/domains"

export JAVA_HOME="/usr/java/latest"
export PATH="${PATH}:${JAVA_HOME}/bin"

export M2_HOME="/u01/wins/wls1221/oracle_common/modules/org.apache.maven_3.2.5"
export MAVEN_HOME="${M2_HOME}"
export MAVEN_OPTS="-Xmx2048m -Xms512m -Dweblogic.security.SSL.ignoreHostnameVerification=true -Dweblogic.security.TrustKeyStore=DemoTrust -Dweblogic.nodemanager.sslHostNameVerificationEnabled=false"
export PATH="${PATH}:${M2_HOME}/bin"
export WL_HOME="${MW_HOME}/wlserver"

###################################################################

export PATH=/u01/python/bin:$PATH

###################################################################

# Source global definitions
if [ -f /home/oracle/setProxy.sh ]; then
  . /home/oracle/setProxy.sh
fi

JAVA_VERSION=`java -version 2>&1 |awk 'NR==1{ gsub(/"/,""); print $3 }'`
echo "Default Java: $JAVA_VERSION"

cat ${DEMOS_HOME}/control/files/bashdisplay.txt

