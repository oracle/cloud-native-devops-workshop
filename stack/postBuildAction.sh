#!/bin/sh

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
  echo "usage: ${0} <id domain> <user id> <user password> <container name>"
  exit -1
fi

export ID_DOMAIN=${1}
export USER_ID=${2}
export USER_PASSWORD=${3}
export CONTAINER_NAME=${4}

export ARCHIVE_FILE="$(find -type f -name '*.zip')"

export ARCHIVE_FILE_NAME=$(basename $ARCHIVE_FILE)

if [ ! -e "$ARCHIVE_FILE" ]; then
  echo "Error: file not found $ARCHIVE_FILE"
  exit -1
fi

echo "Found artifact: $ARCHIVE_FILE"

# CREATE CONTAINER
echo '\n[info] Creating container\n'
curl -i -X PUT \
    -u ${USER_ID}:${USER_PASSWORD} \
    https://${ID_DOMAIN}.storage.oraclecloud.com/v1/Storage-$ID_DOMAIN/$CONTAINER_NAME

# PUT ARCHIVE IN STORAGE CONTAINER
echo '\n[info] Uploading application to storage\n'
curl -i -X PUT \
  -u ${USER_ID}:${USER_PASSWORD} \
  https://${ID_DOMAIN}.storage.oraclecloud.com/v1/Storage-$ID_DOMAIN/$CONTAINER_NAME/$ARCHIVE_FILE_NAME \
      -T $ARCHIVE_FILE
