#!/bin/sh

file="../cloud-utils/environment.properties"

if [ -f "$file" ]
  then
    echo "$file found."
    while IFS="=" read -r key value; do
      case "$key" in
        "opc.identity.domain") OPC_DOMAIN="$value" ;;
        "dbcs.dba.password") DBA_PASS="$value" ;;
        "ssh.privatekey") PK_FILE="$value" ;;
        "jcs.instance.admin.user.1") WLS_USER="$value" ;;
        "jcs.instance.admin.password.1") WLS_PASSWORD="$value" ;;
        "jcs.instance.1") JCS_INSTANCE="$value" ;;
        "dbcs.instance.1") DBCS_INSTANCE="$value" ;;
      esac
    done < "$file"
else
  echo "$file not found."
  exit
fi

echo "Identity domain: $OPC_DOMAIN"

cd ../cloud-utils

JCS_IP=`mvn -Dgoal=jcs-get-ip | awk '/Public IP address of the JCS instance: /{print $NF}'`

echo "Java Cloud Service Public IP address: $JCS_IP"

DBCS_IP=`mvn -Dgoal=dbcs-get-ip | awk '/Public IP address of the DBCS instance: /{print $NF}'`

echo "Database Cloud Service Public IP address: $DBCS_IP"

cd ../techco-app

mvn install

./init-dbcs-pdb.sh system $DBA_PASS ../$PK_FILE $DBCS_IP

echo "Database Cloud Service has been prepared."

cp etc/wlst/deploy-TechCo.py.template etc/wlst/deploy-TechCo.py
sed "s|@wls.admin.user@|$WLS_USER|g; s|@wls.admin.password@|$WLS_PASSWORD|g; s|@database.dba.pass@|$DBA_PASS|g; s|@jcs.instance@|$JCS_INSTANCE|g; s|@database.instance.1@|$DBCS_INSTANCE|g; s|@identity.domain@|$OPC_DOMAIN|g;" -i etc/wlst/deploy-TechCo.py

scp -oStrictHostKeyChecking=no -i ../$PK_FILE target/TechCo-ECommerce-1.0-SNAPSHOT.war etc/wlst/deploy-TechCo.py etc/wlst/deploy-TechCo.sh opc@$JCS_IP:/tmp

ssh -oStrictHostKeyChecking=no -i ../$PK_FILE opc@$JCS_IP "chmod 755 /tmp/deploy-TechCo.py /tmp/deploy-TechCo.sh"
ssh -t -oStrictHostKeyChecking=no -i ../$PK_FILE opc@$JCS_IP "sudo su - oracle -c /tmp/deploy-TechCo.sh"

rm etc/wlst/deploy-TechCo.py

echo "TechCo application has been deployed."
