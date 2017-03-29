#!/bin/sh

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "usage: ${0} <db user> <db password> <ssh key file> <db server ip> [<PDB name>]";
  exit -1;
fi

dbuser=${1}
dbpassword=${2}
sshkey=${3}
ipaddress=${4}
#Default PDB to PDB1 if not specified
if [ -z "$5" ]; then
   pdb="PDB1";
else
  pdb=${5};
fi

cp sql/create_user_template.sql sql/create_user.sql
sed "s|PETSTORE_PASSWORD|${dbpassword}|g" -i sql/create_user.sql

scp -oStrictHostKeyChecking=no -i ${sshkey} sql/create_user.sh sql/create_user.sql ../dpcst/sql/petstore.sql oracle@${ipaddress}:~
ssh -oStrictHostKeyChecking=no -i ${sshkey} oracle@${ipaddress} "sh create_user.sh ${dbuser} ${dbpassword} ${pdb}"

rm sql/create_user.sql
