#!/bin/sh

. /u01/content/weblogic-innovation-seminars/WInS_Demos/control/bin/winsEnv.sh > /dev/null

ADMIN_PORT="7001"
DERBY_PORT="1527"
NM_PORT="5556"
MS1_PORT="7101"
MS2_PORT="7102"

B_ADMIN="F"
B_NM="F"
B_MS1="F"
B_MS2="F"
B_DERBY="F"

#*************************************************************
# List Java processes binded to port
#*************************************************************
sudo netstat -tapen | grep "java" | while read -r line ; do
  case "$line" in 
  *${ADMIN_PORT}*) 
	if [[ ${B_ADMIN} == *"F"* ]] 
	then	
	  echo "Admin server is running on port: ${ADMIN_PORT}"
	  B_ADMIN="T"
        fi
  ;;
  *${NM_PORT}*) 
	if [[ ${B_NM} == *"F"* ]] 
	then	
	  echo "Nodemanager is running on port: ${NM_PORT}"
	  B_NM="T"
        fi
  ;;
  *${MS1_PORT}*) 
	if [[ ${B_MS1} == *"F"* ]] 
	then	
	  echo "Managed server 1 is running on port: ${MS1_PORT}"
	  B_MS1="T"
        fi
  ;;
  *${MS2_PORT}*) 
	if [[ ${B_MS2} == *"F"* ]] 
	then	
	  echo "Managed server 1 is running on port: ${MS2_PORT}"
	  B_MS2="T"
        fi
  ;;
  *1527*)
	if [[ ${B_DERBY} == *"F"* ]] 
	then	
	  echo "Derby server is running on port: ${DERBY_PORT}"
	  B_DERBY="T"
        fi
        ;;
  *) echo "Unknown Java process is running: $line";;
  esac
done

#*************************************************************
# Test to see if Oracle database is running
#*************************************************************
check_stat=`ps -ef|grep ${ORACLE_SID}|grep pmon|wc -l`;
oracle_num=`expr ${check_stat}`
if [ $oracle_num -lt 1 ]
  then
    echo "Oracle database (sid: ${ORACLE_SID}) is NOT running."
    #exit 0
  else
    echo "Oracle database (sid: ${ORACLE_SID}) is running."
  fi

#*************************************************************
# Test to see if Oracle database is accepting connections
#*************************************************************
echo "exit" | sqlplus system/welcome1@orcl | grep Connected > /dev/null
if [ $? -eq 0 ] 
then
   echo "Oracle database listener is SUCCESSFULLY accepting connection."
else
   echo "Oracle database listener is NOT accepting connection."
fi

#*************************************************************
# Check domain directories
#*************************************************************
echo --------------------------------------------------------------
if [ -d $DOMAINS/weblogic-examples-domain ]; then
    echo "weblogic-examples-domain EXISTs in domain directory (${DOMAINS})"
else
    echo "weblogic-examples-domain does NOT exist in domain directory (${DOMAINS})"
fi

if [ -d $DEMOS_HOME/grid-archive-examples/Oracle ]; then
    echo "grid-archive-domain EXISTs in domain directory (${DEMOS_HOME}/grid-archive-examples/Oracle)"
else
    echo "grid-archive-domain does NOT exist in domain directory (${DEMOS_HOME}/grid-archive-examples/Oracle)"
fi

echo ==============================================================
if [ "$1" == "wait" ]; then
  read -p "Press [Enter] to close the window"
fi

