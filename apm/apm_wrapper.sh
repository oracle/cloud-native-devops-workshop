#!/bin/bash

# APM Startup Wrapper for ACCS
# Environment Variables Expected:
#   APP_HOME - Path of unzipped file, created by ACCS automatically
#   APM_REGISTRATION_KEY - Registration key for APM agent, created by user
#   APM_DATACENTER - Datacenter of APM tenant (e.g. us2, em2), created by user
#   APM_IDENTITY_DOMAIN - identity domain name (e.g. tenant name) of APM tenant, created by user

APM_AGENT_HOME=${APP_HOME}/apmagent

echo "APM_REGISTRATION_KEY: ${APM_REGISTRATION_KEY}"
echo "APM_DATACENTER: ${APM_DATACENTER}"
echo "APM_IDENTITY_DOMAIN: ${APM_IDENTITY_DOMAIN}"

[[ -z "$APM_REGISTRATION_KEY" ]] && { echo "APM_REGISTRATION_KEY is not set" ; exit 1; }
[[ -z "$APM_DATACENTER" ]] && { echo "APM_DATACENTER is not set" ; exit 1; }
[[ -z "$APM_IDENTITY_DOMAIN" ]] && { echo "APM_IDENTITY_DOMAIN is not set" ; exit 1; }

APM_REGISTRY_URL="https://${APM_IDENTITY_DOMAIN}.itom.management.${APM_DATACENTER}.oraclecloud.com/registry"
echo "APM Registry URL: ${APM_REGISTRY_URL}"

APM_PROP_FILE=${APM_AGENT_HOME}/config/AgentStartup.properties

# Substitute APM connection/authentication information into properties file

sed "s#@APM_AGENT_HOME@#$APM_AGENT_HOME#g" -i.orig ${APM_PROP_FILE}
sed "s#@REGISTRY_SERVICE_URL@#$APM_REGISTRY_URL#g" -i.orig ${APM_PROP_FILE}
sed "s#@AGENT_TENANT_ID@#$APM_IDENTITY_DOMAIN#g" -i.orig ${APM_PROP_FILE}
echo "oracle.apmaas.common.registrationKey = ${APM_REGISTRATION_KEY}" >> ${APM_PROP_FILE}
echo "oracle.apmaas.common.pathToCertificate = ${APM_AGENT_HOME}/config/emcs.cer" >> ${APM_PROP_FILE}
echo "oracle.apmaas.common.pathToCredentials = ${APM_AGENT_HOME}/config/AgentHttpBasic.properties" >> ${APM_PROP_FILE}

ls -l ${APM_AGENT_HOME}/config
echo "${APM_PROP_FILE} contents:"
cat ${APM_PROP_FILE}

export CATALINA_OPTS="-javaagent:${APM_AGENT_HOME}/lib/system/ApmAgentInstrumentation.jar"
#export JAVA_OPTS="-javaagent:${APM_AGENT_HOME}/lib/system/ApmAgentInstrumentation.jar"

echo "APM CATALINA_OPTS: ${CATALINA_OPTS}"

# Optional, sets up APM logs and tails them out
APM_LOG_DIR=${APM_AGENT_HOME}/logs/tomcat_instance
mkdir -p ${APM_LOG_DIR}
pushd .
cd ${APM_LOG_DIR}
touch AgentErrors.log Agent.log AgentStartup.log AgentStatus.log
popd
tail -F ${APM_AGENT_HOME}/logs/tomcat_instance/*.log &

# Launch first parameter as script, passing remaining parmaters as args to that script
EXEC_BINARY="$1"
shift
exec "$EXEC_BINARY" "$@"
