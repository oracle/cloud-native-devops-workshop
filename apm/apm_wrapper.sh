#!/bin/bash

# APM Startup Wrapper for ACCS
# For use with post-provisioned APM agent folder in APM_AGENT_HOME

APM_AGENT_HOME=${APP_HOME}/apmagent
echo "APM_AGENT_HOME: ${APM_AGENT_HOME}"

APM_PROP_FILE=${APM_AGENT_HOME}/config/AgentStartup.properties

# Replace properties with hardcoded paths. First delete the "pathTo" properties
# then add them back in with the correct paths from APM_AGENT_HOME

sed "/oracle.apmaas.common.pathTo/d" -i.orig ${APM_PROP_FILE}
sed "/oracle.apmaas.agent.hostname/d" -i.orig ${APM_PROP_FILE}
sed "/oracle.apmaas.agent.ignore.hostname/d" -i.orig ${APM_PROP_FILE}
echo "oracle.apmaas.common.pathToCertificate = ${APM_AGENT_HOME}/config/emcs.cer" >> ${APM_PROP_FILE}
echo "oracle.apmaas.common.pathToCredentials = ${APM_AGENT_HOME}/config/AgentHttpBasic.properties" >> ${APM_PROP_FILE}
echo "oracle.apmaas.agent.ignore.hostname = true" >> ${APM_PROP_FILE}

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
touch AgentErrors.log AgentStartup.log
# touch Agent.log AgentStatus.log
popd
tail -F ${APM_AGENT_HOME}/logs/tomcat_instance/*.log &

# Launch first parameter as script, passing remaining parmaters as args to that script
EXEC_BINARY="$1"
shift
exec "$EXEC_BINARY" "$@"
