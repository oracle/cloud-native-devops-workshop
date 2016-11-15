<h2>Cloud tool for Oracle Storage Container, Oracle Database Cloud Services and Oracle Java Cloud Services</h2>

Unofficial Maven based cloud tool to create and delete Oracle Storage/Java/Database Cloud Service instances using Oracle Public Cloud REST management interface. 
This tool is just an experimental tool, about the official CLI tool for Oracle Public Cloud you can get more information [here](https://docs.oracle.com/cloud/latest/jcs_gs/jcs_cli.htm).

Preparation:

1. The SSH connection requires advanced Unlimited Strength Java Cryptography Extension which is not enabled by default in Java due to import control restrictions of some countries. Please [download the necessary extension policy files](http://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html) (local\_policy.jar, US_export_policy.jar) and copy it to your <java-home>/jre/lib/security For detailed information see the instructions attached to policy files.
2. Prepare the property file which includes every information about your OPC access and desired services. Open the file environment.properties in your favorite editor. By default the maven build reads the *environment.properties*, but in case of different file name it is possible to define as parameter e.g.: *-Dopc.properties=myproperties.props* <br>The minimum set of properties to configure are the following:

   	**opc.identity.domain=YOUR\_OPC\_IDENTITY\_DOMAIN**<br>
   	**opc.username=YOUR\_OPC\_ACCOUNT\_USERNAME**<br>
   	**opc.password=YOUR\_OPC\_ACCOUNT\_PASSWORD**<br>
   	**ssh.passphrase=PASSPHRASE\_FOR\_PRIVATE\_KEY**<br>

3. Provide or generate public and private key pair.
  
  1. If you already have public and private keypair (RSA, OpenSSH format) then you need to copy the value of your public key to the following property:<br>
   **ssh.public.key=ssh-rsa AAAAB3NzaC1y........vaPU+vcppMHINDBAbPyT6qNIkl== rsa-key-20150227**<br>
   Copy your private key file into this folder and rename to **pk.openssh** and do not forget to set the **ssh.passphrase=PASSPHRASE_FOR_PRIVATE_KEY** too.
   
  2. Generate key pair with cloud tool. Set only **ssh.passphrase=PASSPHRASE\_FOR\_PRIVATE\_KEY** and execute the following maven build:<br><br>**mvn install -Dgoal=generate-ssh-keypair**<br><br>This will create a private key file (name: pk.openssh) and updates the **ssh.public.key** property with the generated value in the configuration file.<br> This build also creates backup about the existing private key (pk.openssh -> pk.openssh.CURRENT_TIME) and the public key from properties to a file (name: public.key.CURRENT_TIME)<br>Please note if you want to use this generated private key for example Putty access you have to convert (puttygen) the private key to Putty's PPK format.
4. However the DBA and Weblogic admin credentials are provided, but for security reason please change those too.

Once the configuration ready the following OPC management goals are available.

- **generate-ssh-keypair**: backups the current private and public keypair and generates new ones. Using passphrase in configuration file.
- **jcs-create-auto**: provision Java Cloud Service instance including all the prerequsities. First storage container, than Database Cloud Service and finally Java Cloud Service instance based on the configuration defined in property file. Build fails if any component exists.<br>Please NOTE that this build may take more than one hour!
- **storage-list**: list about existing storage conatiners.
- **storage-create**: create storage with name defined in configuration file.
- **storage-get-details**: more information about storage container.
- **storage-delete**: delete storage with name defined in configuration file.
- **dbcs-create**: create Oracle Database Cloud Service instance based on configuration defined in property file.
- **dbcs-get-instance-details**: get more detailed information (public IP address, EM console address, version, status, etc.) about Database Cloud Service Instance.
- **dbcs-delete**: terminate Oracle Database Cloud Service instance.
- **jcs-create**: create Oracle Java Cloud Service instance based on configuration defined in property file.
- **jcs-get-instance-details**: get more detailed information (public IP address, WebLogic admin console address, version, status, etc.) about Java Cloud Service Instance.
- **jcs-delete**: terminate Oracle Java Cloud Service instance.
- **jcs-get-job-details –Djob.id=X**: get more details about Java Cloud Service instance related job. For example status of provisioning or termination. **X** is the job number which is available in the result of **jcs-get-instance-details**

The maven build execution format:

**mvn -Dgoal=GOAL** *-Dopc.properties=myproperties.props*

where the GOAL is one of the feature from the list above. *-Dopc.properties* is optional to define property file with different name than the default *environment.properties*.
