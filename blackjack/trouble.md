# Troubleshooting Tips

These are some of the issues that you may encounter while performing
these exercises and below are the troubleshooting tips and procedures
that you can follow to resolve them.

## Proxy Issue

You may encounter proxy issues with Maven and Netbeans if you are part
of a secured network and behind a fire wall. This is primarily because
when you are creating a new project in Maven or running an existing
Maven project, it tends to download several configuration files and the
download will fail if the proxy settings are not done.

**Note:** Ask your event manager or network administrator for the proxy
address

### Resolving proxy issues in Maven:

1.  Open the C:\\Maven\\apache-maven-3.3.9\\conf\\settings.xml file with
    a text editor like Notepad++.

2.  Add the following lines under the `<proxies>` tag:

    ```xml
    <proxy>
      <id>Oracle</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>**ENTER YOUR PROXY ADDRESS**</host>
      <port>80</port>
      <nonProxyHosts>localhost|oracle.com</nonProxyHosts>
    </proxy>
    ```

3.  Replace **ENTER YOUR PROXY ADDRESS** within the `<host>` tag
    with your proxy and save the file.

### Resolving proxy issues in Netbeans:

1.  Open the C:\\Program Files\\NetBeans
    8.1\\java\\maven\\conf\\settings.xml file with a text editor
    like Notepad++.

2.  Add the following lines under the <proxies> tag:

    ```xml
    <proxy>
      <id>Oracle</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>**ENTER YOUR PROXY ADDRESS**</host>
      <port>80</port>
      <nonProxyHosts>localhost|oracle.com</nonProxyHosts>
    </proxy>
    ```

1.  Replace **ENTER YOUR PROXY ADDRESS** within the `<host>` tag
    with your proxy and save the file.

## Port Conflict Issue

You may encounter a problem in running this project due to a port
conflict issue. This application will be deployed to Apache Tomcat
Server and it requires **8080** local port number to listen to the
client request. Make sure you stop the services running on **8080**
local port number.

**TCPView** tool can be used to identify and terminate the process using
this port number.

[**Download Link**](https://technet.microsoft.com/en-us/sysinternals/bb897437)

## GIT Cloning Error with 403 Status Code

The `git clone` command is supposed to prompt for the user name and
password(cloud account login credentials). If you are not prompted for
user name and password and if this command fails with 403 error then
mention the password explicitly the GIT repository URL.

Here is the updated git clone command with password:

    git clone https://ora1:e1Car030@developer.em2.oraclecloud.com/developer85599-ouopc084/s/developer85599-ouopc084\_helloworlsprojectrepo\_4070/scm/HelloworldProjectRepo.git

Here is the screenshot for your reference:

<img src="images/t/image1.png" width="335" height="228" />
