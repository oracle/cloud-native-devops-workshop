#!/bin/bash

CONTENT_DIR=/u01/content/cloud-native-devops-workshop

echo "Check proxy settings"

sudo rm -f /etc/profile.d/setproxy.sh

GIT_SYSTEM_PROXY_CHECK=`git config --get --system http.proxy`
if [ -n "$GIT_SYSTEM_PROXY_CHECK" ]; then
  echo "Reset proxy settings for Oracle network"
  . ${CONTENT_DIR}/control/bin/setOracleProxy.sh
else
  echo "Reset proxy settings for Non-Oracle network"
  . ${CONTENT_DIR}/control/bin/removeOracleProxy.sh
  unset http_proxy
  unset https_proxy
fi

echo "http_proxy=$http_proxy"
echo "https_proxy=$https_proxy"

echo "========================================"

JAVA_VERSION=`java -version 2>&1 |awk 'NR==1{ gsub(/"/,""); print $3 }'`

if [ $JAVA_VERSION == "1.8.0_60" ]
then
    echo "Default Java version: $JAVA_VERSION"
else
    sudo update-alternatives --set java /usr/java/jdk1.8.0_60/jre/bin/java
    JAVA_VERSION=`java -version 2>&1 |awk 'NR==1{ gsub(/"/,""); print $3 }'`
    echo "Default Java version fixed to: $JAVA_VERSION"
fi

echo "========================================"
echo "Update Firefox proxy settings"
FFPROFILE_FOLDER=$(cat ~/.mozilla/firefox/profiles.ini | grep Path | sed s/^Path=//)

USERJS_FILE=~/.mozilla/firefox/$FFPROFILE_FOLDER/user.js
USERJS_PROXY="user_pref(\"network.proxy.type\", 5);"

grepresult=$(grep -c "$USERJS_PROXY" $USERJS_FILE -s)

if [ -f $USERJS_FILE ] && [ $grepresult == 1 ]
then
    # property already overrided
    echo "Firefox proxy settings (Use system proxy settings) is correct."
else
    # property not yet overrided
    echo $USERJS_PROXY >> $USERJS_FILE
    echo "Firefox proxy settings (Use system proxy settings) has been updated."
fi
echo "========================================"
echo "Update Desktop Icon"

sed "s|Update WInS Demos|Update Demos|g" -i ~/Desktop/Update\ Demos.desktop

echo "========================================"


echo "Everything is up to date!"
