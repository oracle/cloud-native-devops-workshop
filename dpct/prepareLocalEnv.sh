#!/bin/bash

export DPCT_DIR=$PWD

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "usage: ${0} <db user> <db password> [<PDB name>]";
  exit -1;
fi

dbuser=${1}
dbpassword=${2}
#Default PDB to PDBORCL if not specified
if [ -z "$3" ]; then
   pdb="PDBORCL";
else
  pdb=${3};
fi

#*************************************************************
# Test to see if Oracle database is running
#*************************************************************
check_stat=`ps -ef|grep ${ORACLE_SID}|grep pmon|wc -l`;
oracle_num=`expr ${check_stat}`
if [ $oracle_num -lt 1 ]
then
  echo "Oracle database (sid: ${ORACLE_SID}) is NOT running. Starting database first."
    
  $ORACLE_HOME/bin/dbstart $ORACLE_HOME
else
  echo "Oracle database (sid: ${ORACLE_SID}) is running."
fi

echo "Open pluggable database: ${pdb}."
sqlplus -s sys/${dbpassword} as sysdba <<EOF
set feedback off;
set serveroutput on;
declare
  pdb_counter NUMBER(1);
begin
  select count(1) into pdb_counter from v\$pdbs where name = upper('${pdb}') and open_mode != 'READ WRITE';
  if pdb_counter > 0 then
    dbms_output.put_line('${pdb} is not yet opened'); 
    EXECUTE IMMEDIATE 'alter pluggable database ${pdb} open';
  else
    dbms_output.put_line('${pdb} is already opened');
  end if;  
end;
/
exit;
EOF

sleep 3

echo "********** CREATING PetStore DB USER **********************************************"

sqlplus -s system/${dbpassword}@${pdb} <<EOF
 drop user petstore cascade;

 create user petstore identified by petstore;
 grant DBA to petstore;
 exit;
EOF

echo "********** CREATING DB ENTRIES FOR PetStore Application ***************************"

sqlplus petstore/petstore@${pdb} <<EOF
 @sql/petstore.sql
 exit;
EOF

export JAVA_HOME=/usr/java/jdk1.7.0_79/
export MW_HOME=/u01/wins/wls1036/

echo "********** STARTING ADMIN (WEBLOGIC 10.3.6 - DOMAIN1036) **************************"
cd /u01/wins/wls1036/user_projects/domains/Domain1036/bin
nohup ./startWebLogic.sh &>adminserver.log </dev/null  &

sleep 3

tail -f /u01/wins/wls1036/user_projects/domains/Domain1036/bin/adminserver.log | while read LOGLINE
do
   [[ "${LOGLINE}" == *"Server state changed to RUNNING"* ]] && pkill -P $$ tail
done

echo "********** ADMIN SERVER (WEBLOGIC 10.3.6 - DOMAIN1036) HAS BEEN STARTED ***********"

export JAVA_HOME=/usr/java/latest/
export MW_HOME=/u01/wins/wls1221/

echo "********** STARTING ADMIN SERVER (WEBLOGIC 12.2.1 - DOMAIN1221) *******************"
cd /u01/wins/wls1221/user_projects/domains/Domain1221/bin
nohup ./startWebLogic.sh &>adminserver.log </dev/null  &

sleep 3

tail -f /u01/wins/wls1221/user_projects/domains/Domain1221/bin/adminserver.log | while read LOGLINE
do
   [[ "${LOGLINE}" == *"Server state changed to RUNNING"* ]] && pkill -P $$ tail
done
echo "********** ADMIN SERVER (WEBLOGIC 12.2.1 - DOMAIN1221) HAS BEEN STARTED ***********"
