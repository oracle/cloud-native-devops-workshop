#!/bin/sh

ORACLE_HTTP_PROXY="http:\/\/www-proxy.us.oracle.com:80"

#=========================================================
MAVENCONF_FILE=~/.m2/settings.xml

mvnresult=$(grep -c "<proxies>" $MAVENCONF_FILE -s)

if [ $mvnresult == 1 ]
then
    # maven configured for proxy
    echo "Maven is already configured for proxy."
else
    # maven not configured for proxy, need to uncomment
    sed "s|<!--proxies>|<proxies>|g" -i $MAVENCONF_FILE
    sed "s|</proxies-->|</proxies>|g" -i $MAVENCONF_FILE
    echo "Maven now has been configured for proxy."
fi
#=========================================================
YUMCONF_FILE=/etc/yum.conf

grepresult=$(grep -c "proxy=$ORACLE_HTTP_PROXY" $YUMCONF_FILE -s)

if [ $grepresult == 1 ]
then
    # yum configured for proxy, need to delete
    echo "yum is already configured for proxy."
else
    # yum not configured for proxy, need to add
    sudo sed -i '$ a\'"proxy=$ORACLE_HTTP_PROXY"'' $YUMCONF_FILE
    echo "yum now has been configured for proxy."
fi
#=========================================================
BASHRC_FILE=/home/oracle/.bashrc

grepresult=$(grep -c "export http_proxy=$ORACLE_HTTP_PROXY" $BASHRC_FILE -s)

if [ $grepresult == 1 ]
then
    # bashrc configured for proxy, need to delete
    echo "~/.bashrc is already configured for proxy."
else
    # bashrc not configured for proxy, need to add
    sed -i '$ a\'"export http_proxy=$ORACLE_HTTP_PROXY"'' $BASHRC_FILE
    sed -i '$ a\'"export https_proxy=$ORACLE_HTTP_PROXY"'' $BASHRC_FILE
    echo "~/.bashrc now has been configured for proxy."
fi
#=========================================================

# remove escape chars ('\') from proxy URL
ORACLE_HTTP_PROXY=$(echo $ORACLE_HTTP_PROXY|sed "s@\\\\@@g")

sudo git config --system http.proxy ${ORACLE_HTTP_PROXY}
sudo git config --global http.proxy ${ORACLE_HTTP_PROXY}

export http_proxy=$ORACLE_HTTP_PROXY
export https_proxy=$ORACLE_HTTP_PROXY

echo "http_proxy set to: [${http_proxy}]"
echo "https_proxy set to: [${https_proxy}]"

echo "Proxy Configured for Oracle Network!!!"

echo "This window will close automatically/or continue running in 3s..."
sleep 3

