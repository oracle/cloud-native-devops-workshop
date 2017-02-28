# PART III: Test, Build and Deploy the BlackJack Web Service App

## Downloading BlackJack Project from the Repository

 Download the [blackjack.zip](BlackJack.zip) file to your local machine

## Deploying the BlackJack Application on a Local Server

Use the following instructions to deploy the BlackJack application to
Apache Tomcat Server bundled with the project.

1.  Open Windows Explorer and navigate to the **cloud** directory.

2.  Inside the **cloud** directory, create a directory named
    **BlackJack** and copy the **BlackJack.zip** file that you
    downloaded in the earlier exercise.

3.  Unzip the **BlackJack.zip** file to the **cloud** **>**
    **BlackJack** directory.

4.  Launch Netbeans using the shortcut on the desktop.

5.  Open the **blackjack-part2** project in Netbeans.

    <img src="images/3/image1.png" width="314" height="163" />

    **Note:** If you see a \[Unloaded\] tag against the project name then
    right-click on the project and select, **Resolve Project Problems**
    and then click on Resolve button. Please wait until Netbeans downloads
    the Maven related files then click on close button.

6.  Right-click the project and select the **Clean and**
    **Build** option.

    <img src="images/3/image2.png" width="132" height="167" />

7.  Right-click the project and select **Run** to deploy the project on
    Tomcat Server.

    <img src="images/3/image3.png" width="138" height="173" />

8.  Select **com.example.blackjack.rest.Application** from the Available
    Main Classes list and click the **Select Main Class** button.

    <img src="images/3/image4.png" width="252" height="245" />

9.  You should receive a “*Started Application in
    &lt;&lt;seconds&gt;&gt; seconds (JVM running for 5.19)*” message in
    the Output window.

    <img src="images/3/image5.png" width="490" height="280" />

    **Note:** You may encounter a problem in running this project due to a
    port conflict issue. This application will be deployed to Apache Tomcat
    Server and it requires **8080** local port number to listen to the
    client request. Make sure you stop the services running on **8080**
    local port number.

    **TCPView** tool can be used to identify and terminate the process using
    this port number.

    [**Download Link**](https://technet.microsoft.com/en-us/sysinternals/bb897437)

## Testing the Locally Deployed BlackJack Application

An HTML-5 client application has been developed and supplied with the
BlackJack application to test its functionality once deployed on a
local/remote server.

Use the following instructions to test the BlackJack application.

1.  Open Windows Explorer and navigate to the **cloud >
    BlackJack > html5-client** directory.

2.  Open the index.html file with a browser.

3.  Make sure that the first field, **Service**, is populated with
    **<http://127.0.0.1:8080/>** value, enter a number between 1 and 9
    in the second field, and then click Connect.

    <img src="images/3/image6.png" width="528" height="229" />

4.  Once you connect to the gaming console, click the **Debug on/off**
    button to view the Debug console.

    <img src="images/3/image7.png" width="535" height="251" />

You can use the **Hit** and **Stand** buttons available on the UI to
play the game.

This HTML5 Client application interacts with the BlackJack gaming
application deployed on Tomcat Server running locally on your computer.
Close this HTML5 Client application once you are done.

## Generating Application Archive Files for the BlackJack Application

Oracle Application Container Cloud can deploy and run Java Platform,
Standard Edition (Java SE), and Node.js applications. First, to deploy
your application, we compress the application in a **ZIP** or **Gzipped
Tar (TGZ)** archive file, which includes the required configuration
information.

Use the following instructions to create an application archive.

1.  Open the blackjack-part2 application in Netbeans if it is not
    opened already.

2.  Right-click the project and click **Clean**.

    <img src="images/3/image8.png" width="165" height="192" />

3.  Open Windows Explorer, navigate to **cloud > BlackJack >
    blackjack-part2**, and make a note of the directory structure and
    its contents.

    <img src="images/3/image9.png" width="444" height="102" />

    **Note:** The manifest.json file is required for all applications
    deployed to Oracle Application Container Cloud Service. If this file
    is not present in the root directory of the .zip, .tar, or .tar.gz
    file, deployment will fail. At a minimum, this file specifies the
    major version of the runtime environment and the launch command.

    **Content of manifest.json file in this example**:

    ```json
    {
      "runtime": {
        "majorVersion": "8"
      },
      "command": "java -jar blackjack-part2-1.0.jar",
      "release": {
        "version": "1.0",
        "build": "1",
        "commit": "1A2B345"
      },
      "notes": "Blackjack Web Service"
    }
    ```

4.  Switch to Netbeans, right-click the project, and click **Build.**

    <img src="images/3/image10.png" width="184" height="237" />

5.  Switch to the **cloud > BlackJack > blackjack-part2**
    directory and notice that a new directory named **target**
    is created.

6.  Examine the **target** directory. You will notice that **.zip and
    .tar.gz** distribution files have been generated. These are
    application archive files that we can use to deploy to OACCS.

    <img src="images/3/image11.png" width="466" height="178" />

## Creating a New Project in Developer Cloud Service

Use the following instruction to create an empty Project on Developer
Cloud Service

1.  Login to your oracle cloud account.

2.  Click **Developer Cloud Service** on the Dashboard to go to the
    **ServiceDetails:developer85599 (Oracle Developer
    Cloud Service)** page.

    <img src="images/3/image12.png" width="466" height="137" />

3.  Click the **Open Service Console** button.

    <img src="images/3/image13.png" width="460" height="225" />

4.  Click **New Project**.

    <img src="images/3/image14.png" width="378" height="232" />

5.  Enter the Project Name and Description as shown in the following
    screenshot and click **Next**.

    <img src="images/3/image15.png" width="378" height="268" />

6.  Click the **Empty Project** template and **Next**.

    <img src="images/3/image16.png" width="378" height="271" />

7.  Select **MARKDOWN** from the Wiki Markup drop-down list and click
    **Finish.**

    <img src="images/3/image17.png" width="388" height="280" />

8.  Provisioning BlackJack-Part2 project may take several minutes. Wait
    until all the modules are provisioned and redirected to the
    BlackJack-Part2 home screen.

    <img src="images/3/image18.png" width="444" height="161" />

## Creating a GIT Repository in Developer Cloud Service

Use the following instructions to create an empty GIT repository on
Developer Cloud Service.

1.  Click the **New Repository** button in the **REPOSITORIES** section.

    <img src="images/3/image19.png" width="426" height="154" />

2.  In the New Repository window, enter the repository name and
    description as shown in the following screenshot and click **Create**.

    <img src="images/3/image20.png" width="426" height="362" />

3.  It may take a few minutes to create a repository. Wait until the
    BlackJack-Part2Repo repository is created and redirected to its
    home page.

    <img src="images/3/image21.png" width="426" height="112" />

4.  Click the HTTP tab in the BlackJack-Part2Repo home page and copy
    the URL.

    <img src="images/3/image22.png" width="546" height="143" />

## Cloning a GIT Repository

Use the following instructions to clone the BlackJack-Part2 project to a
GIT repository on Developer Cloud Service.

1.  To clone a GIT repository, first change to the cloud/BlackJack
    directory that is the root directory for your repository.

2.  Execute `git clone https://ora1@developer.em2.oraclecloud.com/developer85599-ouopc084/s/developer85599-ouopc084\_blackjack-part2\_4112/scm/BlackJack-Part2Repo.git`

    <img src="images/3/image23.png" width="507" height="166" />

    **Notes:**

    -   Enter your cloud account username and password, if you are prompted.
    -   If you are not prompted for user name and password and if this
        command fails with 403 error then mention the password explicitly
        the GIT repository URL. For example: `git clone https://ora1@developer.em2.oraclecloud.com/developer85599-ouopc084/s/developer85599-ouopc084\_blackjack-part2\_4112/scm/BlackJack-Part2Repo.git`
    -   The output of this command should be similar to the output in the
        above screenshot.

3.  Notice that there is a new directory named **BlackJack-Part2Repo**
    created inside **cloud/BlackJack** directory.

4.  Copy and paste **blackjack-part2** project directory from
    **cloud/BlackJack** directory to **BlackJack-Part2Repo** directory

    **Note:** Content of the **BlackJack-Part2Repo** directory should
    match with the contents listed below screenshot.

    <img src="images/3/image24.png" width="535" height="94" />

5.  Change to the **BlackJack-Part2Repo** directory

        cd BlackJack-Part2Repo

6.  Add the source files to GIT from project root directory

        git add .

7.  Commit the changes

        git commit –m "commiting changes to BlackJack-Part2Repo repository"

8.  Push the files to the repository on Developer Cloud Service

        git push origin master

    **Note:** Wait until all the files are pushed to repository

9.  Switch to Developer Cloud Service to verify the files pushed to the
    repository

10. In the **BlackJack-Part2** home page, click on **BlackJack-Part2Repo.git**

    <img src="images/3/image25.png" width="474" height="178" />

11. Notice that **blackjack-part2** project directory has been pushed to
    repository on Developer Cloud Service. Click on it and verify
    its contents.

    <img src="images/3/image26.png" width="478" height="154" />

## Building a Project on Developer Cloud Service

Use the following instructions to build BlackJack-Part2 project in
Developer Cloud Service.

1.  In the left navigation pane, click on **Build** and then **New Job**.

    <img src="images/3/image27.png" width="421" height="190" />

2.  In the New Job window, enter **BlackJack-Part2BuildJob** in the job
    name field and click on **Save**.

    <img src="images/3/image28.png" width="421" height="147" />

3.  In the **Main** tab, enter the following values:

    -   Edit the job name if it needs adjusting.
    -   Enter a description.
    -   Set the **JDK** to **JDK 8.**

    <img src="images/3/image29.png" width="421" height="188" />

4.  Click the **Source Control** tab

    -   Select **Git** as your repository.
    -   For **URL**, select the URL to your Git repository.

    <img src="images/3/image30.png" width="391" height="203" />

5.  Click the **Triggers** tab

    -   Based on SCM polling schedule

    <img src="images/3/image31.png" width="391" height="178" />

    **Note:** This setting will enable auto-deploy feature of DevCS. After
    the application is modified and if the changes are committed to GIT
    repository on DevCS, it automatically picks up the updated code and
    deploys.

6.  Click the **Build Steps** tab.

    -   Click Add Build Step and select Invoke Maven 3.
    -   Set the **Goals** to: clean package.
    -   Set the **POM File** location to: Helloworld-Example/pom.xml

    <img src="images/3/image32.png" width="397" height="171" />
    <img src="images/3/image33.png" width="397" height="216" />

7.  Click the **Post Build** tab.

    -   Select Archive the artifacts.
    -   Set **Files To Archive** to: blackjack-part2/target/blackjack-part2-1.0.jar,
        blackjack-part2/target/blackjack-part2-1.0-dist.zip
    -   Set Compression Type to **NONE**.

    <img src="images/3/image34.png" width="451" height="186" />

8.  Click **Save** and then click **Build Now**.

    If the build was successful, you'll see two files in the **Artifacts of Last Successful Build** section:
    -   blackjack-part2/target/blackjack-part2-1.0.jar
    -   blackjack-part2/target/blackjack-part2-1.0-dist.zip

    You can download them by clicking the file name.

    If the build failed then go back to check the build job configuration
    or click **Git Logs** to see more information about the error.

    <img src="images/3/image35.png" width="451" height="181" />

## Deploying a Project to ACCS from DevCS

Use the following instructions to deploy the BlackJack-Part2 to
Application Container Cloud Service from Developer Cloud Service.

1.  In the left navigation pane, click on **Deploy** and then **New
    Configuration**

    <img src="images/3/image36.png" width="436" height="171" />

2.  In the **New Deployment Configuration** page, enter
    the **Configuration Name** and **Application Name** as shown below

    <img src="images/3/image37.png" width="436" height="173" />

3.  In the **Deployment Target** field, click **New** and
    select **Application Container Cloud**

    <img src="images/3/image38.png" width="233" height="119" />

4.  In the **Deploy to Application Container Cloud** window, enter the
    following values and click **Test connection**

    -   Data center
    -   Identity Domain
    -   Username
    -   Password

    <img src="images/3/image39.png" width="273" height="131" />

5.  When you see the **Successful** message click **Use Connection**

    <img src="images/3/image40.png" width="273" height="131" />

6.  Enter the following values and click **Save**

    -   **Type**: Automatic (Select Deploy stable build only)
    -   **Job:** BlackJack-Part2BuildJob
    -   **Runtime**: Java
    -   **Subscription:** Monthly
    -   **Artifact:** blackjack-part2/target/blackjack-part2-1.0-dist.zip

    <img src="images/3/image41.png" width="393" height="137" />

7.  Click the gear icon <img src="images/3/image42.png" width="51" height="28" />
    and then select **Start** to deploy the application to Oracle
    Application Container Cloud Service.

8.  After the successful deployment, right-click on Blackjack-Part2
    project name and copy the URL

    <img src="images/3/image43.png" width="393" height="130" />

## Testing the BlackJack Application Deployed to OACCS from DevCS

An HTML-5 client application has been developed and supplied with the
BlackJack application to test its functionality once deployed on a
local/remote server.

Use the following instructions to test the BlackJack application.

1.  Open Windows Explorer and navigate to the **cloud >
    BlackJack > html5-client** directory.

2.  Open the index.html file with a browser.

3.  Make sure that the first field, **Service**, is populated with the
    URL you copied in the previous exercise,
    <https://blackjack-part2-ouopc084.apaas.em2.oraclecloud.com/>. Enter a
    number between 1 and 9 in second field, and then click Connect.

    <img src="images/3/image44.png" width="513" height="230" />

4.  Once you connect to the gaming console, click the **Debug on/off**
    button to view the Debug console.

    <img src="images/3/image45.png" width="513" height="247" />

    **Note:** You can use the **Hit** and **Stand** buttons available on the
    UI to play the game.

This HTML5 Client application interacts with the BlackJack gaming
application deployed on OACCS on cloud.

## Activating Oracle Application Container Cloud Service (OACCS)

**Important Note:** The cloud login credentials and link are required to
perform this part of the lab activity. Gather this information from the
email you have received from Oracle and keep it handy.

For the purpose of creating this document, a cloud instance from the
EMEA region Data Center was used. You will get a cloud instance from the
NAMER region Data Center; select the Data Center accordingly.

1.  Sign In to Oracle Cloud account (Refer to **Activating Developer
    Cloud Service** activity for detailed instruction on how to Sign In)

2.  On a successful Sign In, we can see the **Identity Domain Name** and
    the **Username** on the Welcome page.

    <img src="images/3/image46.png" width="380" height="152" />

3.  Services that are assigned to your account will be visible on
    the Dashboard. If the **Application Container** service is not
    visible, click the **Customize Dashboard** button and **Show**
    button for **Application Container** to make it visible on
    the Dashboard.

    <img src="images/3/image47.png" width="372" height="180" />

4.  Click the **Application Container** on the Dashboard to go to the
    **Service Details: Oracle Application Container Cloud** page.

    <img src="images/3/image48.png" width="366" height="126" />

## Direct Deployment of BlackJack Application to OACCS

In this activity, you will learn to deploy an application archive to
ACCS directly. We are using the same sample application, BlackJack for
this deployment too.

Use the following instructions to deploy the BlackJack application to
OACCS directly.

1.  Click the **Open Service Console** button.

    <img src="images/3/image49.png" width="385" height="148" />

2.  Click the **Create Application** and **Java SE** buttons**.**

    <img src="images/3/image50.png" width="261" height="170" />

3.  In the **Create Application** dialog box, enter BlackJack-part3 for
    the application name, select **Monthly** for the subscription type,
    and enter **Deploying BlackJack Application to ACCS directly** in
    the Notes field. For the Application Archive field, select **Upload
    Archive**.

    <img src="images/3/image51.png" width="248" height="291" />

4.  Browse and select the **blackjack-part2-1.0-dist.zip** file from the
    **target** directory.

    <img src="images/3/image52.png" width="366" height="221" />

5.  The **Create Application** dialog box now shows the selected file.
    Under **Instance**, review the number of instances and the memory
    size, and make any necessary adjustments. Click **Create** to deploy
    your application to Oracle Application Container Cloud.

    <img src="images/3/image53.png" width="225" height="263" />

6.  A status message appears indicating that it is **Processing Archive.**

    <img src="images/3/image54.png" width="295" height="207" />

7.  After the archived application is uploaded, the service determines
    whether the archive is properly configured. If it is, the following
    dialog box appears. Click **OK**.

    <img src="images/3/image55.png" width="270" height="125" />

8.  It will take several minutes to deploy the application. The
    deployment status can be viewed under the In-Progress
    Activity section.

    <img src="images/3/image56.png" width="348" height="228" />

9.  You should see a **Status: Succeeded** message in the Activity
    section once the application has been deployed successfully.

    <img src="images/3/image57.png" width="480" height="112" />

10. Copy the application URL and paste it in a notepad. We will need
    this URL for testing purposes.

    <img src="images/3/image58.png" width="486" height="147" />

## Testing the BlackJack Application Deployed on OACCS

An HTML-5 client application has been developed and supplied with the
BlackJack application to test its functionality once deployed on a
local/remote server.

Use the following instructions to test the BlackJack application.

1.  Open Windows Explorer and navigate to the **cloud >
    BlackJack > html5-client** directory.

2.  Open the index.html file with a browser.

2.  Make sure that the first field, **Service**, is populated with the
    URL you copied in the previous exercise,
    <https://blackjack-part3-ouopc084.apaas.em2.oraclecloud.com/>.
    Enter a number between 1 and 9 in second field, and then
    click Connect.

    <img src="images/3/image59.png" width="520" height="141" />

3.  Once you connect to the gaming console, click the **Debug on/off**
    button to view the Debug console.

    <img src="images/3/image45.png" width="513" height="247" />

    **Note:** You can use the **Hit** and **Stand** buttons available on the
    UI to play the game.

This HTML5 Client application interacts with the BlackJack gaming
application deployed on OACCS on cloud.

With this you have successfully completed deploying BlackJack
application to local server and testing, cloning BlackJack application
to GIT repository on DevCS, creating a build job and deploying BlackJack
application to ACCS from DevCS and testing with auto deploy feature
enabled.
