#!/bin/sh
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "usage: ${0} <database user> <database password> <PDB name>";
  exit -1;
fi

dbuser=${1}
dbpassword=${2}
pdb=${3}
cat create_user.sql | sqlplus ${dbuser}/${dbpassword}@${pdb}

cat oe-min-drop-create.sql | sqlplus oe/${dbpassword}@${pdb}