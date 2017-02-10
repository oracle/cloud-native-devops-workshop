#!/bin/bash

export CONTENT_DIR="/u01/content/cloud-native-devops-workshop"
export GIT_URL="https://github.com/oracle/cloud-native-devops-workshop.git"
export GIT_BRANCH="master"

sudo $CONTENT_DIR/control/bin/sudoNetwork.sh

cd $CONTENT_DIR
timeout 5 git ls-remote --exit-code -h "$GIT_URL"
if [ "$?" -ne 0 ]; then
    echo "[ERROR] Unable to read from '$GIT_URL'"
    echo "Check your proxy settings and/or restart Virtualbox VM."
    if [ "$1" == "wait" ]; then
       read -p "Press [Enter] to close the window"
       exit 1;
    fi
fi

echo "Using GIT_URL=[${GIT_URL}]"
echo "Getting BRANCH=[${GIT_BRANCH}]"
echo "Cloning remote repository to ${CONTENT_DIR}..."

GIT_SYSTEM_PROXY=`git config --get --system http.proxy`
GIT_GLOBAL_PROXY=`git config --get --global http.proxy`

echo "GIT _system_ Proxy set to: [${GIT_SYSTEM_PROXY}] (OK to be empty)"
echo "GIT _global_ Proxy set to: [${GIT_GLOBAL_PROXY}] (OK to be empty)"

if [ ! -e ${CONTENT_DIR} ]; then
  cd /u01/content
  git clone ${GIT_URL}
  cd ${CONTENT_DIR}
  git checkout ${GIT_BRANCH}
else
  cd ${CONTENT_DIR}
  git fetch

  git reset --hard origin/${GIT_BRANCH}

  echo "========================================"
  echo "The file(s) below is not tracked by git:"
  git clean -n
  echo "========================================"
fi

cp ${CONTENT_DIR}/control/bin/updateDemos.sh /home/oracle/

echo "Updating virtualbox environment..."

${CONTENT_DIR}/control/bin/updateVM.sh

read -p "Checkout complete. Press [Enter] to close the window"
