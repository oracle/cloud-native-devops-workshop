#!/bin/bash

echo "SUDO1==============================START"

GIT_SYSTEM_PROXY_CHECK=`git config --get --system http.proxy`
if [ -n "$GIT_SYSTEM_PROXY_CHECK" ]; then
  export http_proxy=$GIT_SYSTEM_PROXY_CHECK
  export https_proxy=$GIT_SYSTEM_PROXY_CHECK
  echo "http_proxy=$http_proxy"
  echo "https_proxy=$https_proxy"
else
  unset http_proxy
  unset https_proxy
  echo "http_proxy=$http_proxy"
  echo "https_proxy=$https_proxy"
fi

rm -f /var/run/yum.pid

sleep 3

yum clean all

yum -y install zlib

yum -y install openssl-devel

echo "SUDO1================================END"
