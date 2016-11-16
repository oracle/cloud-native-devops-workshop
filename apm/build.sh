#!/bin/bash

# Build script to build WAR and move create Tomcat server w/ APM agent

# Make sure that the following environment varibles are set:
#   AGENTINSTALL_ZIP_URL
#   AGENT_REGISTRATION_KEY
# It's recommended that you put the AgentInstall.zip you get from the
# OMC tenant into the Maven tenant and use the URL to the artifact.


MAVEN_PROJECT_DIR=../springboot-sample
MAVEN_PROJECT_WAR=target/springbootdemo-0.0.1.war.original

TOMCAT_VERSION=8.5.6
TOMCAT_DIST=apache-tomcat-${TOMCAT_VERSION}
TOMCAT_DL_URL="http://archive.apache.org/dist/tomcat/tomcat-8/v8.5.6/bin/apache-tomcat-8.5.6.tar.gz"

APP_HOME="`pwd`"

echo "War File name: ${WAR_FILE}"
if [[ -z ${WAR_FILE} ]]; then
  echo "Make sure that WAR_FILE is set"
  exit 1
fi

# Setup proxy
if [ -n "$HTTP_PROXY" ]; then
  echo "HTTP Proxy is set to ${HTTP_PROXY}"
  PROXY_ARG="--proxy ${HTTP_PROXY}"
  export http_proxy=${HTTP_PROXY}
  export https_proxy=${HTTP_PROXY}
fi

# Check APM Agent Env Prerequisites
echo "AgentInstall.zip DL URL: ${AGENTINSTALL_ZIP_URL}"
echo "apm_stage.zip DL URL: ${APMSTAGE_ZIP_URL}"
if [[ -z ${AGENTINSTALL_ZIP_URL} ]] && [[ -z ${APMSTAGE_ZIP_URL} ]]; then
  echo "Make sure AGENTINSTALL_ZIP_URL or APMSTAGE_ZIP_URL are set"
  exit 1
fi

echo "Agent Registration Key: ${AGENT_REGISTRATION_KEY}"
if [[ -z ${AGENT_REGISTRATION_KEY} ]]; then
  echo "Make sure AGENT_REGISTRATION_KEY is set"
  exit 1
fi

# Clean up any artifacts left from previous builds
rm -rf tomcat-Treadmill-dist.zip
rm -rf ${TOMCAT_DIST}

mkdir agent_stage

pushd .
cd agent_stage
# If we provided an APMSTAGE URL, use that, otherwise use AgentInstall.sh
if [[ ${APMSTAGE_ZIP_URL} ]]; then
  curl -o apm_stage.zip "${APMSTAGE_ZIP_URL}"
  unzip apm_stage.zip
else
  curl -o AgentInstall.zip "${AGENTINSTALL_ZIP_URL}"
  unzip AgentInstall.zip -d .
  chmod a+rx AgentInstall.sh
  ./AgentInstall.sh AGENT_TYPE=apm STAGE_LOCATION=apm_stage AGENT_REGISTRATION_KEY="${AGENT_REGISTRATION_KEY}"
fi

cd apm_stage
chmod a+rx ProvisionApmJavaAsAgent.sh
echo "yes" | ./ProvisionApmJavaAsAgent.sh -no-wallet -d "${APP_HOME}"
popd

# Any agent config customizations
sed 's#\(excludedServletClasses\" \: \[ \)#\1\"org.apache.cxf.transport.servlet.CXFServlet\", #' -i "${APP_HOME}/apmagent/config/Servlet.json"

# Build the project
pushd .
cd ${MAVEN_PROJECT_DIR}
mvn --version
mvn clean package
popd

# Download Tomcat distribution
curl -X GET \
   ${PROXY_ARG} \
   -o ${TOMCAT_DIST}.tar.gz \
   "${TOMCAT_DL_URL}"

# Extract Tomcat distribution
tar -xf ${TOMCAT_DIST}.tar.gz

# Move project WAR to webapps dir as root deployment, removing default one
rm -rf ${TOMCAT_DIST}/webapps/ROOT
rm -rf ${TOMCAT_DIST}/webapps/examples
rm -rf ${TOMCAT_DIST}/webapps/docs
cp ${MAVEN_PROJECT_DIR}/${MAVEN_PROJECT_WAR} ${TOMCAT_DIST}/webapps/${WAR_FILE}

# Make sure wrapper has correct perms
chmod a+rx apm_wrapper.sh

# Create application archive with Tomcat (with Treadmill war) and manifest.json
zip -r application.zip manifest.json ${TOMCAT_DIST} apmagent apm_wrapper.sh

# Remove the expanded Tomcat distribution
rm -rf ${TOMCAT_DIST} apmagent
