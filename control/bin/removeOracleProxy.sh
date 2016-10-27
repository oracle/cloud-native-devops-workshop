#!/bin/sh

. /u01/content/weblogic-innovation-seminars/WInS_Demos/control/bin/winsEnv.sh

ORACLE_HTTP_PROXY="http:\/\/www-proxy.us.oracle.com:80"

echo "Remove Maven proxy settings"
rm -f ~/.m2/settings.xml

#=========================================================
YUMCONF_FILE=/etc/yum.conf

grepresult=$(grep -c "proxy=$ORACLE_HTTP_PROXY" $YUMCONF_FILE -s)

if [ $grepresult == 1 ]
then
    # yum configured for proxy, need to delete
    sudo sed -i "/proxy=$ORACLE_HTTP_PROXY/ d" $YUMCONF_FILE
    echo "proxy has been removed from yum configuration"
fi
#=========================================================
BASHRC_FILE=/home/oracle/.bashrc

grepresult=$(grep -c "export http_proxy=$ORACLE_HTTP_PROXY" $BASHRC_FILE -s)

if [ $grepresult == 1 ]
then
    # ~/.bashrc configured for proxy, need to delete
    sudo sed -i "/export http_proxy=$ORACLE_HTTP_PROXY/ d" $BASHRC_FILE
    sudo sed -i "/export https_proxy=$ORACLE_HTTP_PROXY/ d" $BASHRC_FILE
    echo "proxy has been removed from ~/.bashrc configuration"
fi
#=========================================================

PROXY_SCRIPT="/home/oracle/setProxy.sh"
PROXY_MESSAGE="Proxy NOT SET for Oracle Network!!!"

echo "#!/bin/sh" > ${PROXY_SCRIPT}
echo "echo \"${PROXY_MESSAGE}\"" >> ${PROXY_SCRIPT}
echo "echo \"${PROXY_MESSAGE}\"" >> ${PROXY_SCRIPT}
echo "echo \"${PROXY_MESSAGE}\"" >> ${PROXY_SCRIPT}

cd ~
sudo git config --system --unset http.proxy
sudo git config --global --unset http.proxy
sudo git config -f $DEMOS_HOME/../.git/config --unset http.proxy

echo "Removing Proxy Settings from GIT!"

chmod +x ${PROXY_SCRIPT}

GIT_SYSTEM_PROXY=`git config --get --system http.proxy`
GIT_GLOBAL_PROXY=`git config --get --global http.proxy`
GIT_PROJECT_PROXY=`git config --get -f $DEMOS_HOME/../.git/config http.proxy`

echo "GIT _system_ Proxy set to: [${GIT_SYSTEM_PROXY}]"
echo "GIT _global_ Proxy set to: [${GIT_GLOBAL_PROXY}]"
echo "GIT _project_ Proxy set to: [${GIT_PROJECT_PROXY}]"

unset http_proxy
unset https_proxy

echo "http_proxy set to: [${http_proxy}]"
echo "https_proxy set to: [${https_proxy}]"

echo "This window will close automatically/or continue running in 3s..."
sleep 3
