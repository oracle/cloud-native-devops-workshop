
![](images/studentguide/Picture-Title.png)  
Update: January 28, 2017

## Trial Account Student Guide

This Oracle Trial Account Student Guide will provide you with the instructions nessesary to install the Client Tools used during this workshop. This Workshop will allow you to gain exposure to the Oracle Developer Cloud Service, the Oracle Application Container Cloud Service, and open source products such as Eclipse, Maven, Git, and Brackets. ***Complete Steps 1 and 2***

## 1. Oracle Cloud Environment Setup

If you are using an **Oracle Trial/Try It** account, there is an ***Account Configuration*** Step you must perform before attempting the Hands on Workshop labs.  
- You must **Configure Your Storage Replication Policy**. After you receive your account credentials, you can set the replication policy by follow the steps in the ***Setting the Storage Replication*** section of this document. 

## 2. Client Enviroment Options

Your client enviroment ***must be configured prior*** to attempting the Hands on Workshop, or you will not be able to complete the Workshop labs. 

You have two options for configuring your workshop client environment. 

- ***Option 1***: You can install Virtual Box and download and run a pre-configured **Virtual Box Image**. 
- Refer to the ***Virtual Box Client Installation*** section of this document to use this option
- **This option is best**, if you don't want to worry about installing and configuring multiple Open Source Software tools on your laptop. 
- ***Option 2***: You can **install and configure** Eclipse, Brackets and Git on your laptop.
- Refer to the ***Configure Client Tools Locally*** section of this document to use this option.
- **This option is best** if you want to install and configure the opensource software on your laptop, or your corporate standards will not let you install a hypervisor, or your laptop's resorces are not adequate to run virtual images. 

# Configure Your Storage Replication Policy

### Login to your Oracle Cloud Account
- From any browser, go to the URL:
`https://cloud.oracle.com`

- click **Sign In** in the upper right hand corner of the browser

    ![](images/100/Picture100-1.png)

- **IMPORTANT** - Under my services, select from the drop down list the correct data center and click on **My Services**. If you are unsure of the data center you should select, and this is an in-person training event, ***ask your instructor*** which **Region** to select from the drop down list. If you received your account through an Oracle Trial, your Trial confirmation email should provide a URL that will pre-select the region for you.

![](images/100/Picture100-2.png)

- Enter your identity domain and click **Go**.

**NOTE:** The **Identity Domain, User Name** and **Password** values will be given to you by the instructor or within your Trial confirmation email.

    ![](images/100/Picture100-3.png)

- Once your Identity Domain is set, enter your User Name and Password and click **Sign In**

    ![](images/100/Picture100-3.5.png)

- You will be presented with a Dashboard displaying the various cloud services available to this account.

    ![](images/100/Picture100-4.png)

- If all your **Storage** cloud service is not visible, **click** on the **Customize Dashboard**, you can add services to the dashboard by clicking **Show.** For this workshop, you will want to ensure that you are showing at least the **Application Container, Developer and Storage** cloud services. If you do not want to see a specific service, click **Hide**

    ![](images/100/Picture100-5.png)

### Check/Set Storage Replication Policy

Depending on the state of your Cloud Account, you may need to set the replication policy, if it has not been previously set. In this step you will go to the Storage Cloud Service to check on the status of the Replicaton Policy. 

- Click on the **Storage** Cloud Service
    ![](images/100/Picture-01.png)

- Click on the **Open Service Console** icon at the top of the screen.

    ![](images/100/Picture-01.5.png)

- If the follow dialog is displayed, care must be taking when setting your replication policy, because it cannot be changed. Take the default and click on the **Set Policy** button. If the message is not displayed, your replication policy has already been set, and your Cloud Account is ready for the Workshop.

    ![](images/100/Picture-02.5.png)

- Your replication policy is now set, and you can close your browser window. 

# Virtual Box Client Installation

As an alternative to installing Eclipse, Brackets and Git on your laptop, you can follow these steps to download a Virtual Box image that will contain all those products pre-integrated together.

### Hardware Requirements

- You will need a machine capable of running the wokrshop image within Oracle Virtual Box (MAC or PC / Minumum of 50GB of free storage / 8GB RAM)

- You will need full Administrator privileges on your machines, and in some cases will need to set Hardware Virtualization in the BIOS.

- Hardware Virtualization needs to be enabled in the BIOS to properly run Virtual Box.  If you getting virtualization errors, reboot into the BIOS and make sure that the setting to enable Hardware Virtualization is enabled. 

- The latest version of Virtual Box should be installed and tested prior to the workhop.

### Copy OVA file

**Note**: you will download all 6 zip files. You can then use software such as winzip or 7zip to automatically unzip all 6 files into a single *.ova file that can be imported into virtual box. 

- [Download](https://www.virtualbox.org/wiki/Downloads) and install Virtual box 

- Download this workshops [Virtual box OVA zip files](https://publicdocs-corp.documents.us2.oraclecloud.com/documents/link/LFF42D5B385ADB4324B055CBF6C3FF17C1177E4725F3/folder/FA853951DE14FED12E559568F6C3FF17C1177E4725F3/_VM), and unzip.

### Unzip and import OVA File

- Startup **Oracle Virtual Box**

    ![](images/studentguide/Picture22.png)

- From top left menu select **File -> Import Appliance**

    ![](images/studentguide/Picture23.png)

- Click on **browse** icon to select file to import.

- Navigate to the unzipped OVA file, and Click **Open**

    ![](images/studentguide/Picture24.png)

- Once the File is selected click **Next** to continue.

    ![](images/studentguide/Picture25.png)

- Keep all the defaults and click **Import**

    ![](images/studentguide/Picture26.png)

- Wait for import to complete. The time required to import will vary depending on the speed of your hard disk.

    ![](images/studentguide/Picture27.png)

### Start Virtual Box Image

- After completion of the import, you should see the Oracle Public Cloud image in a Powered Off state. The default settings will work, but if you are familiar with Virtual Box, you are welcome to change any of the settings.

![](images/studentguide/Picture28.png)

- With the **Oracle Public Cloud** selected, click **Start**.

    ![](images/studentguide/Picture29.png)

- After a few minutes you will have a running image that will be used for all of the labs.

    ![](images/studentguide/Picture30.png)

# Configure Client Tools Locally

## Verify your version of the Java JDK

Eclipse requires that you have the **JDK 8** installed.

### JDK Verification on a MAC

**Note**: Eclipse requires that you have the a Java JDK 8 installed. Even if you have a JRE version 8, you still need to verify that you have a JDK 8 installed. 

- Open Terminal window and execute the following command: 

```
ls /Library/java/JavaVirtualMachines/
```

- If you do not have a JDK 1.8 folder, you will need to download the [JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) from the Oracle Technology Network website, and install.

### JDK Verification on Windows

- On Windows, open a **cmd** window and enter `java -version` 

```
C:\Users\usr>java -version
java version "1.8.0_121"
Java(TM) SE Runtime Environment (build 1.8.0_121-b13)
Java HotSpot(TM) Client VM (build 25.121-b13, mixed mode, sharing)
```

- If JDK/**Java version 1.8** is not installed,  you will need to download a [JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) from the Oracle Technology Network website, and install.

## Download and Install Eclipse

### Download Eclipse

***Note***: If you already have Eclipse installed, you will still want to install and use the version documented below, for this version of Eclipse contains the **Oracle Enterprise Pack for Eclipse**, which will be used during the workshop.

- Go to the [Eclipse](http://www.oracle.com/technetwork/developer-tools/eclipse/downloads/index.html) installation website

- Accept the **licensing agreement**, and then select the **Neon** version of Eclipse required for your operating system.

    ![](images/studentguide/Picture1.png)

- Once you’ve downloaded eclipse, extract the zip file and install.


### Optionally Configure Proxies (if behind a firewall)

If you are running Eclipse behind a firewall and need to configure the proxy setting, there are several updates to be made. First, you need to ensure that Eclipse’s proxy is set, next you need to update the maven proxy setting, and then finally, you need to ensure that the Oracle Plugin will work with your proxy settings.

- To set configure Eclipse’s proxy, open Eclipse and navigate to the Properties menu. Depending on the operating system, this drop down is found either from the **Eclipse > Preferences, or Window > Preferences**

    ![](images/studentguide/Picture2.png)

- From the preferences panel, enter “**proxy**” into the search window, and click on **Network Connections**. Select **Native** for the Active Provider. This setting works well, but it requires that you have the proxy setting configured correctly on the system running Eclipse – e.g. Windows, MAC OS or Linux. Selecting Manual should also work, but some of the plugins require the underlying operating system’s proxy to be configured.

    ![](images/studentguide/Picture3.png)

- To test that your connection works, select the menu option **Window > Show View > Other**

    ![](images/studentguide/Picture4.png)

- Type “**web**” in the search field, select **Internal Web Browser** and click on **OK**

    ![](images/studentguide/Picture5.png)

- Enter a **URL** into the browser and press **enter** to test your proxy settings.

![](images/studentguide/Picture6.png)

### Optionally Update the Eclipse / Maven proxy (if behind a firewall)

- From the **Eclipse > Preference or Window > Preferences** panel, enter **Maven** into the search box. Click on the Maven User Settings. Make note of the directory where the settings.xml file is to be located. In the example below, the Maven User Settings are to be located in the **/home/oracle/.m2** directory

    ![](images/studentguide/Picture7.png)

- Close Eclipse    

- If the directory does not exist where the settings.xml file is to be located, **create the directory**. In this example, we will create the **.m2** directory. 

- Also, create the **settings.xml** file, if it does not exist. Add the following to the settings.xml file (NOTE: you will need to use your correct **Host, Port, nonProxyHosts, username and Password settings**):

```
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd">
<proxies>
<proxy>
<active>true</active>
<protocol>http</protocol>
<username>proxyuser</username>
<password>proxypass</password>
<host>www-proxy.us.oracle.com</host>
<port>80</port>
<nonProxyHosts>local.net|some.host.com</nonProxyHosts>
</proxy>
<proxy>
<active>true</active>
<protocol>https</protocol>
<username>proxyuser</username>
<password>proxypass</password>
<host>www-proxy.us.oracle.com</host>
<port>80</port>
<nonProxyHosts>local.net|some.host.com</nonProxyHosts>
</proxy>
</proxies>
</settings>
```

- Reload Eclipse to use the new maven settings

## Download Installing Brackets and Git

### Download Git

- Go to the following URL: https://git-scm.com/downloads

    ![](images/studentguide/Picture8.png)

- Select your OS. In our example, we will show how to install on Windows. Click **Windows** Download and click **Save File**

    ![](images/studentguide/Picture9.png)

- Select your download location and click **Save**. We will use D:\Software    

    ![](images/studentguide/Picture10.png)

- Open Windows Explorer and navigate you where you downloaded the Git executable. Double click on the Git executable to start the install process.

    ![](images/studentguide/Picture11.png)

- Run through the installation process

    ![](images/studentguide/Picture12.png)

### Download Brackets Text Editor

- Go to the following URL: http://brackets.io    

    ![](images/studentguide/Picture13.png)

- Click **Download Brackets 1.X** then click **Save File**

    ![](images/studentguide/Picture14.png)

- Select you download location and click **Save**. We will use D:\Software

    ![](images/studentguide/Picture15.png)

- Open Windows Explorer and navigate you where you downloaded Brackets. Double click on the Brackets executable to start the install process.

![](images/studentguide/Picture16.png)

- Run through the installation process

### Start Brackets and Configure Git

- Create a directory called **TwitterMarketingUI**. From Windows Explorer navigate to the directory **TwitterMarketingUI**, right click and select **Open as Brackets Project**

    ![](images/studentguide/Picture17.png)

- Select **File -> Extension Manager…**

- In the search field, type **GIT**. Click **Install** for Brackets Git

    ![](images/studentguide/Picture18.png)

- After the install completes, leave the defaults for Git Settings and click **Save**

    ![](images/studentguide/Picture19.png)

- Click **OK** to restart Brackets

    ![](images/studentguide/Picture20.png)

- You will now see the Git icon on the right-hand panel

    ![](images/studentguide/Picture21.png)

