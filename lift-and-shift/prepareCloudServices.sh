#!/bin/sh

LASDIR=$PWD

file="../cloud-utils/environment.properties"

if [ -f "$file" ]
  then
    echo "$file found."
    while IFS="=" read -r key value; do
      case "$key" in
        "opc.identity.domain") OPC_DOMAIN="$value" ;;
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

cd $LASDIR

mvn install -DLiftAndShift -Djcs.ip=$JCS_IP -Ddbcs.ip=$DBCS_IP

echo "Database Cloud Service has been prepared."
echo "Java Cloud Service has been prepared."
