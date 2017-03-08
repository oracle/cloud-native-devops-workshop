# PART II: Test and Build Helloworld App using Oracle Developer Cloud Service

## Setting Proxy for Maven

**Important Note:** Use the following instructions to change the proxy
settings for Maven if you are part of the secured network and behind a
firewall **ONLY** otherwise skip this activity and continue with the
next activity, **Creating a GIT Repository**.

### Proxy Settings for Maven in Netbeans

1.  Open the C:\\Program Files\\NetBeans
    8.1\\java\\maven\\conf\\settings.xml file with a text editor
    like Notepad++.

    **Note:** On a Mac the settings.xml file can be found at
    /Applications/NetBeans/NetBeans 8.1.app/Contents/Resources/Netbeans/java/maven/conf/settings.xml

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

3.  Replace **ENTER YOUR PROXY ADDRESS** within the <host> tag
    with your proxy and save the file.

**Note:** If you are facing problems in editing the settings.xml file,
save a copy of the settings.xml file to some other location, modify it,
and then put it back in to C:\\Program Files\\NetBeans
8.1\\java\\maven\\conf\\ (Windows) or /Applications/NetBeans/NetBeans 8.1.app/Contents/Resources/Netbeans/java/maven/conf/ (Mac) directory.

### Proxy Settings for Maven

1.  Open the C:\\Maven\\apache-maven-3.3.9\\conf\\settings.xml file with
    a text editor like Notepad++.

    **Note:** On a Mac the settings.xml file can be found at /Applications/apache-maven-3.3.9/conf/settings.xml

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

3.  Replace **ENTER YOUR PROXY ADDRESS** within the <host> tag
    with your proxy and save the file.

## Creating a GIT Repository

As part of this activity, you will learn to create and initialize a
local GIT repository under user’s home directory.

1.  Open Git Bash from the Windows **Start** menu or open a terminal window if using a Mac.

2.  In your home directory, create a **cloud** directory.

        mkdir cloud

3.  Change the directory to **cloud** directory.

        cd cloud

4.  Create a Git repository type.

        git init

5.  The cloud directory is now a Git repository. Execute the `ls –a`
    command to confirm the same. The output of the `ls –a` command must
    match the output in the following screenshot:

    <img src="images/2/image1.png" width="497" height="124" />

    **Note:** Now you should see that a .git directory has been created
    inside the cloud directory and your repository is ready.

## Configuring a GIT Repository

Before you commit changes to GIT repository, you must configure your
name and email address to identify your commits in the repository.

1.  Execute the following commands to configure your name:

        git config --global user.name "Your Name"

    **Example:** `git config –global user.name "John Doe"`

2.  Execute the following commands to configure your email address:

        git config --global user.email your-email@address

    **Example:** `git config –global user.email <john.doe@oracle.com>`

3.  To confirm that the values have been set, execute the following
    command:

        git config --global –l

The output of these commands must be similar to the output in the
following screenshot:

<img src="images/2/image2.png" width="420" height="219" />

**Notes:**
-   This sets your name and email address for all GIT projects.
-   Don’t use --global option to set the name and email address at the
    project level.

## Creating a Project with Maven Archetypes

As part of this activity, you will learn to create a simple Maven
application named, **Helloworld-Example** to print "Hello World!"
message on the console. This application will be used in the subsequent
activities to store it in a local GIT repository, creating a project on
DevCS, clone it with GIT repository on DevCS and then creating a Build
Job for deployment.

Use the following instructions to create a Maven project using Archetypes.

1.  Open Git Bash from the Windows Start menu or open a terminal window if using a Mac.

2.  Change to the cloud directory where your Git repository is stored.

        cd cloud

3.  Create a directory named helloworld.

        mkdir helloworld

4.  Change to the Helloworld directory.

        cd helloworld

5.  Create an empty Maven project using the
    maven-archetype-quickstart archetype. Enter the following command:

        mvn archetype:generate -DgroupId=com.example -DartifactId=Helloworld-Example -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

    **Note:** The output of this command must be similar to the output in the following screenshot:

    <img src="images/2/image3.png" width="317" height="363" />

6.  The command creates an empty Maven project named
    **Helloworld-Example**. Examine the directory structure and note
    that an executable class is located at com.example.App. Now the
    pom.xml file must be configured for  
    plug-ins.

7.  Launch Netbeans using the shortcut on the desktop.

8.  Open the **Helloworld-Example** Maven project created under
    **cloud/helloworld** directory in Netbeans.

    <img src="images/2/image4.png" width="374" height="193" />

9.  Examine the directory structure of the project, open
    **com.example.App** executable class, and review the code.

    <img src="images/2/image5.png" width="384" height="181" />

10. Right-click the **Project Files > pom.xml** file and click Open.

    <img src="images/2/image6.png" width="242" height="242" />

11. Add the following properties settings to the file before the
    dependencies section. This sets the Java version and encoding for
    the project.

    ```xml
    <properties>
      <java.version>1.8</java.version>
      <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    ```

12. After the dependencies element, add elements for build and plug-ins.

    ```xml
    <build>
      <plugins>
      <!-- Your plugins go here -->
      </plugins>
    </build>
    ```

13. Add the configuration for the compiler plug-in to the
    plug-ins section.

    ```xml
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>2.3.2</version>
      <configuration>
        <source>1.8</source>
        <target>1.8</target>
      </configuration>
    </plugin>
    ```

14. Add the exec plug-in to the pom.xml file.

    ```xml
    <plugin>
      <groupId>org.codehaus.mojo</groupId>
      <artifactId>exec-maven-plugin</artifactId>
      <version>1.4.0</version>
      <executions>
        <execution>
          <goals>
            <goal>exec</goal>
          </goals>
        </execution>
      </executions>
      <configuration>
        <mainClass>com.example.App</mainClass>
      </configuration>
    </plugin>
    ```

15. Add the JAR plug-in to the pom.xml file.

    ```xml
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-jar-plugin</artifactId>
      <version>2.6</version>
      <configuration>
        <archive>
          <manifest>
            <mainClass>com.example.App</mainClass>
          </manifest>
        </archive>
      </configuration>
    </plugin>
    ```

16. In the source window, right-click the **pom.xml** file and select **Format** to fix the indentation for the file.

    <img src="images/2/image7.png" width="276" height="227" />

17. Save the **pom.xml** file.

18. Right-click the **Helloworld-Example** project and click **Clean
    and Build.**

19. Right-click the **Helloworld-Example** project and click **Run.**

    <img src="images/2/image8.png" width="231" height="196" />

20. Select **com.example.App** from the Available Main Classes list and
    click the **Select Main Class** button.

    <img src="images/2/image9.png" width="231" height="225" />

21. You should see **Hello World!** Output with a BUILD SUCCESS message.

    <img src="images/2/image10.png" width="406" height="152" />

22. Switch to Git Bash(Windows) or terminal window(Mac) and change the
    directory to Helloworld-Example.

        cd Helloworld-Example

    <img src="images/2/image11.png" width="395" height="100" />

23. Execute the `mvn clean compile` command to clean and compile
    the project.

    <img src="images/2/image12.png" width="363" height="387" />

24. Execute the `mvn exec:java` command to execute the application.

    <img src="images/2/image13.png" width="360" height="297" />

25. Execute the `mvn package command` to package the application.

    <img src="images/2/image14.png" width="435" height="235" />

    **Note:** Examine the **Helloworld-Example-1.0-SNAPSHOT.jar** file
    created inside **cloud/helloworld/Helloworld-Example/target**
    directory.

26. Execute the `java -jar target/Helloworld-Example-1.0-SNAPSHOT.jar`
    command to run the packaged application.

    <img src="images/2/image15.png" width="454" height="120" />

## Checking the Helloworld-Example Project into a GIT Repository

Use the following instructions to store the Helloworld-Example project
in the local GIT repository.

1.  Change into the cloud/helloworld directory.

2.  Execute the `git add –n .` command to see the list of files that are
    ready to be added to the repository.

    <img src="images/2/image16.png" width="408" height="102" />

    **Note:** Please notice that there is **.** at the end of the command.

3.  Execute the `git add .` command to add the files to the repository.

    <img src="images/2/image17.png" width="408" height="102" />

4.  Execute the `git status` command to check the files that are added.

    <img src="images/2/image18.png" width="408" height="106" />

5.  Execute the `git commit –m "Initial Commit for Helloworld-Example
    Project"` to commit the files to the repository and begin
    version tracking.

    <img src="images/2/image19.png" width="415" height="108" />

6.  Your files are now checked in for version tracking.

7.  Check the status of the repository by executing the `git status command`.

    <img src="images/2/image20.png" width="415" height="84" />

    **Note:** You should get a response similar to the one in the
    screenshot.

## Creating a Developer Cloud Service Project

As part of this activity, you will choose a replication policy (if it
not already done by Identity Domain Administrator) to define your
primary data center and also specifies whether your data should be
replicated to a geographically distant (secondary) data center.

Activate Developer Cloud Service to create an empty project
(HelloworldProject) with a repository (HelloworldProjectRepo) to push
the Helloworld-Example **application** that you have created in the
previous **activity** to Developer Cloud Service.

**Note:** The cloud login credentials and link are required to perform
this part of the exercise. Gather this information from the email you
have received from Oracle and keep it handy.

## Configure Your Storage Replication Policy

### Login to your Oracle Cloud Account

1. From any browser, go to the URL: <https://cloud.oracle.com>

2. Click **Sign In** in the upper right hand corner of the browser

    <img src="images/2/Picture100-1.png" width="429" height="119" />

3. **IMPORTANT** - Under my services, select from the drop down list the correct data center and click on **My Services**. If you are unsure of the data center you should select, and this is an in-person training event, ***ask your instructor*** which **Region** to select from the drop down list. If you received your account through an Oracle Trial, your Trial confirmation email should provide a URL that will pre-select the region for you.

    <img src="images/2/Picture100-2.png" />

4. Select your identity domain and click **Go**.

    **NOTE:** The **Identity Domain, User Name** and **Password** values will be given to you by the instructor or within your Trial confirmation email.

5. Once your Identity Domain is set, enter your User Name and Password and click **Sign In**

    <img src="images/2/Picture100-3.5.png" />

6. You will be presented with a Dashboard displaying the various cloud services available to this account.

    <img src="images/2/Picture100-4.png" />

7. If all your **Storage** cloud service is not visible, **click** on the **Customize Dashboard**, you can add services to the dashboard by clicking **Show.** For this workshop, you will want to ensure that you are showing at least the **Application Container, Developer and Storage** cloud services. If you do not want to see a specific service, click **Hide**

    <img src="images/2/Picture100-5.png" />

### Check/Set Storage Replication Policy

Depending on the state of your Cloud Account, you may need to set the replication policy, if it has not been previously set. In this step you will got to the Storage Cloud Service to check on the status of the Replicaton Policy.

1. Click on the **Storage** Cloud Service
    <img src="images/2/Picture-01.png" />

2. Click on the **Open Service Console** icon at the top of the screen.

    <img src="images/2/Picture-01.5.png" />

3. If the follow dialog is displayed, care must be taking when setting your replication policy, because it cannot be changed. Take the default and click on the **Set Policy** button. If the message is not displayed, your replication policy has already been set, and your Cloud Account is ready for the Workshop.

    <img src="images/2/Picture-02.5.png" />

4. Your replication policy is now set, and you can close your browser window.



### Verifying the Replication Policy Selected for Your Service Instance through the My Services Portal

To find out the replication policy that’s selected for your Oracle
Storage Cloud Service instance, click the **Storage** link in the
**Dashboard** page. On the resulting page, expand **Service Details:
Oracle Storage Cloud Service,** the details of your Oracle Storage Cloud
Service instance is displayed. Look for the Replication Policy field, as
highlighted in the following screenshot.

<img src="images/2/image30.png" width="348" height="116" />

## Activating Developer Cloud Service and Creating a New Project

In this activity, you are going to activate Developer Cloud Service,
create a new project in DevCS, create a GIT repository in DevCS, clone
locally built project with DevCS GIT repository and the create a build
job for deployment.

Use the following instructions to activate DevCS and create a new
project.

1.  Services that are assigned to your account will be visible on
    the Dashboard. If the **Developer** service is not visible, click
    the **Customize Dashboard** button and the **Show** button for
    **Application Container** to make it visible on the Dashboard.

    <img src="images/2/image31.png" width="378" height="237" />

2.  Click **Developer Cloud Service** on the Dashboard to go to the
    **ServiceDetails:developer85599 (Oracle Developer
    Cloud Service)** page.

    <img src="images/2/image32.png" width="454" height="134" />

3.  Click the **Open Service Console** button.

    <img src="images/2/image33.png" width="399" height="195" />

4.  Click **New Project**.

    <img src="images/2/image34.png" width="399" height="245" />

5.  Enter the Project Name and Description as shown in the following
    screenshot and click **Next**.

    <img src="images/2/image35.png" width="399" height="288" />

6.  Click the **Empty Project** template and **Next.**

    <img src="images/2/image36.png" width="378" height="271" />

7.  Select **MARKDOWN** from the Wiki Markup drop-down list and click
    **Finish**.

    <img src="images/2/image37.png" width="384" height="277" />

8.  Provisioning HelloworldProject may take several minutes. Wait until
    all the modules are provisioned and redirected to the
    HelloworldProject home screen.

    <img src="images/2/image38.png" width="388" height="141" />

## Creating a GIT Repository in Developer Cloud Service

Use the following instructions to create a GIT repository on Developer
Cloud Service.

1.  Click the **New Repository** button in the **REPOSITORIES** section.

    <img src="images/2/image39.png" width="360" height="130" />

2.  In the New Repository window, enter the repository name and
    description as shown in the following screenshot and click **Create**.

    <img src="images/2/image40.png" width="351" height="282" />

3.  It may take a few minutes to create a repository. Wait until the
    HelloworldProjectRepo repository is created and redirected to the
    HelloworldProjectRepo home page.

    <img src="images/2/image41.png" width="384" height="103" />

4.  Click the HTTP tab in the HelloworldProjectRepo home page and copy
    the URL.

    <img src="images/2/image42.png" width="384" height="106" />

## Cloning a GIT Repository

Use the following instructions to clone the Helloworld-Example project
to a GIT repository on Developer Cloud Service.

1.  To clone a GIT repository, first change to the cloud/helloworld
    directory that is the root directory for your repository.

2.  Execute `git clone https://ora1@developer.em2.oraclecloud.com/developer85599-ouopc084/s/developer85599-ouopc084_helloworldproject_3753/scm/HelloworldProjectRepo.git`

    <img src="images/2/image43.png" width="427" height="111" />

    **Notes:**
    -   Enter your cloud account username and password, if you are prompted.
    -   If you are not prompted for user name and password and if this
        command fails with 403 error then mention the password explicitly
        the GIT repository URL. For example: `git clone https://ora1:e1Car030@developer.em2.oraclecloud.com/developer85599-ouopc084/s/developer85599-ouopc084\_helloworlsprojectrepo\_4070/scm/HelloworldProjectRepo.git`
    -   The output of this command should be similar to the output in the
        above screenshot.

3.  Notice that there is a new directory named **HelloworldProjectRepo**
    created inside **cloud/helloworld** directory.

4.  Copy and paste **Helloworld-Example** project directory from
    **cloud/helloworld** directory to **HelloworldProjectRepo**
    directory

    **Note:** Content of the **HelloworldProjectRepo** directory should
    match with the contents listed below screenshot.

    <img src="images/2/image44.png" width="441" height="89" />

5.  Change to the **HelloworldProjectRepo** directory

        cd HelloworldProjectRepo

6.  Add the source files to GIT from project root directory

        git add .

7.  Commit the changes

        git commit –m "commiting changes to HelloworldProjectRepo repository"

8.  Push the files to the repository on Developer Cloud Service

        git push origin master

9.  Switch to Developer Cloud Service to verify the files pushed to the
    repository

10. In the **HelloworldProject** home page, click on **HelloworldProjectRepo.git**

    <img src="images/2/image45.png" width="378" height="150" />

11. Notice that **Helloworld-Example** project directory has been pushed
    to repository on Developer Cloud Service. Click on it and verify
    its contents.

    <img src="images/2/image46.png" width="385" height="153" />

    <img src="images/2/image47.png" width="385" height="158" />

## Building a Project on Developer Cloud Service

Use the following instructions to build Helloworld-Example project
Developer Cloud Service.

1.  In the left navigation pane, click on **Build** and then **New Job**

    <img src="images/2/image48.png" width="457" height="201" />

2.  In the New Job window, enter **HelloworldProjectBJ** the job name
    field and click on **Save**

    <img src="images/2/image49.png" width="457" height="167" />

3.  In the **Main** tab, enter the following values:

    -   Edit the job name if it needs adjusting.
    -   Enter a description.
    -   Set the **JDK** to **JDK 8.**

    <img src="images/2/image50.png" width="433" height="204" />

4.  Click the **Source Control** tab

    -   Select **Git** as your repository.
    -   For **URL**, select the URL to your Git repository.

    <img src="images/2/image51.png" width="433" height="211" />

5.  Click the **Build Steps** tab.

    -   Click Add Build Step and select Invoke Maven 3.
    -   Set the **Goals** to: clean package.
    -   Set the **POM File** location to: Helloworld-Example/pom.xml

    <img src="images/2/image52.png" width="441" height="189" />

    <img src="images/2/image53.png" width="441" height="235" />

6.  Click the **Post Build** tab.

    -   Select Archive the artifacts.
    -   Set **Files To Archive** to: Helloworld-Example/target/Helloworld-Example-1.0-SNAPSHOT.jar
    -   Set Compression Type to NONE.

    <img src="images/2/image54.png" width="443" height="184" />

7.  Click **Save** and then click **Build Now.**

    If the build was successful, you'll see a file:
    Helloworld-Example/target/Helloworld-Example-1.0-SNAPSHOT.jar in
    the **Artifacts of Last Successful Build** section. You can download
    it by clicking the file name.

    If the build failed then go back to check the build job configuration
    or click **Git Logs** to see more information about the error.

    <img src="images/2/image55.png" width="453" height="183" />

    With this you have successfully completed creating a local GIT
    repository, creating a Maven project, storing Maven project in local
    GIT repository, activating DevCS, creating a project and GIT
    repository in DevCS, cloning project to DevCS and then creating a
    build job for deployment.
