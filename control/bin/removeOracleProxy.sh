#!/bin/sh

ORACLE_HTTP_PROXY="http:\/\/www-proxy.us.oracle.com:80"

#=========================================================
MAVENCONF_FILE=~/.m2/settings.xml

mvnresult=$(grep -c "<proxies>" $MAVENCONF_FILE -s)

if [ $mvnresult == 1 ]
then
    # maven configured for proxy, need to comment
    sed "s|<proxies>|<!--proxies>|g" -i $MAVENCONF_FILE
    sed "s|</proxies>|</proxies-->|g" -i $MAVENCONF_FILE
    echo "Proxy has been removed from Maven configuration."
else
    # maven not configured for proxy, need to uncomment
    echo "Maven is not configured for proxy."
fi
#=========================================================
YUMCONF_FILE=/etc/yum.conf

grepresult=$(grep -c "proxy=$ORACLE_HTTP_PROXY" $YUMCONF_FILE -s)

if [ $grepresult == 1 ]
then
    # yum configured for proxy, need to delete
    sudo sed -i "/proxy=$ORACLE_HTTP_PROXY/ d" $YUMCONF_FILE
    echo "Proxy has been removed from yum configuration"
fi
#=========================================================
BASHRC_FILE=/home/oracle/.bashrc

grepresult=$(grep -c "export http_proxy=$ORACLE_HTTP_PROXY" $BASHRC_FILE -s)

if [ $grepresult == 1 ]
then
    # ~/.bashrc configured for proxy, need to delete
    sudo sed -i "/export http_proxy=$ORACLE_HTTP_PROXY/ d" $BASHRC_FILE
    sudo sed -i "/export https_proxy=$ORACLE_HTTP_PROXY/ d" $BASHRC_FILE
    echo "Proxy has been removed from ~/.bashrc configuration"
fi
#=========================================================

echo "Removing Proxy Settings from GIT!"

sudo git config --system --unset http.proxy
sudo git config --global --unset http.proxy

unset http_proxy
unset https_proxy

echo "Proxy NOT SET for Oracle Network!!!"

echo "This window will close automatically/or continue running in 3s..."
sleep 3

