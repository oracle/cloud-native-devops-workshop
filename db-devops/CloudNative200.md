
![](images/200/PictureLab200.png)  

Update: March 1, 2017

# Introduction

This is the Second of several labs that are part of the **Oracle Public Cloud Native Database** workshop. This workshop will walk you through the Software Development Lifecycle (SDLC) for a Cloud Native project that will create and use several Microservices.

In the previous lab (100), the Project Manager several tasks and assigned them to the various developer roles.  In this lab, you will assume the role of database developer (Roland Dubois) who will make the required changes to the MySQL Database.

**Please direct comments to: Derrick Cameron (derrick.cameron@oracle.com)**

## Objectives

- Access Developer Cloud Service
- Import code from external Git Repository
- Initialize a new test MySQL Database
- Apply schema and data updates to a local MySQL database
- Deploy updates to the test MySQL Database

## Required Artifacts

The following lab an Oracle Public Cloud account that will be supplied by your instructor. In this account you will use Developer Cloud Service, MySQL Cloud Service, and a Compute Cloud Service.  The Compute Cloud Service is an image that has the required client tools, including Eclipse.

# Create Initial Test MySQL Database

## Explore Developer Cloud Service

### **STEP 1**: Login to your Oracle Cloud Account

- If you just completed lab 100 and you are still logged in you can continue, otherwise log in.
- Click **Sign In** in the upper right hand corner of the browser

    ![](images/200/image003.png)  

- ***IMPORTANT*** - Under My Services, ***ask your instructor*** which **Region** to select from the drop down list, and **click** on the **My Services** button.

    ![](images/200/image004.png)  

- Enter your identity domain and click **Go**

    **NOTE:** the **Identity Domain, User Name and Password** values will be given to you from your instructor.

    ![](images/200/image005.png)  

- Once your Identity Domain is set, enter your User Name and Password and click **Sign In**

    ***NOTE:*** For this lab you will be acting as the Database Developer ***Roland Dubois***. As with the previous lab, if you are not able to support multiple users, login as a supported user, and assume the “logical” identify of Roland Dubois, the Datbase Developer.

    ![](images/200/image006.png)  

- You will be presented with a Dashboard displaying the various cloud services available to this account.  Your particular account may differ from this.

    ![](images/200/image007.png)  

### **STEP 2:**	Login to Developer Cloud Service

Oracle Developer Cloud Service provides a complete development platform that streamlines team development processes and automates software delivery. The integrated platform includes issue tracking system, agile development dashboards, code versioning and code review platform, continuous integration and delivery automation, as well as team collaboration features such as wikis and live activity stream. With a rich web based dashboard and integration with popular development tools, Oracle Developer Cloud Service helps deliver better applications faster.

- From Cloud UI dashboard click on the **Developer** service. In our example the Developer Cloud Service is named **developer76638**.

    ![](images/200/image008.png)  

- The Service Details page gives you a quick glance of the service status.

    ![](images/200/image009.png)  

- Click **Open Service Console** for the Oracle Developer Cloud Service. The Service Console will list all projects that you are currently a member.

    ![](images/200/image010.png)  

### **STEP 3**: Review Agile Board

- Click **Twitter Feed Marketing Project** to access the project.

    ![](images/200/image011.png)

- Click on **Agile** in navigation panel.

    ![](images/200/image012.png)  

- If the **Microservices** is not the default board, click on the current board’s dropdown, select the filter **All**, and click on **Microservices**

    ![](images/200/image013.png)  

- Click on the **Microservices** Board **Active Sprints**.

    ![](images/200/image014.png)  

## Create Initial Git Repository

### **STEP 4**: Create Initial Git Repository

As in the previous lab, we maintain a separate repository for database related updates. To pull his code into the Developer Cloud Service, we will clone his external GIT repository. First let’s update our agile board to show that we are working on this task:

- Drag and drop **Task 1 - Create Initial GIT Repository for Database changes** into the **In Progress** swim-lane.  Click **OK** on Change Progress popup.

    ![](images/200/image015.png)  

- Click on **Project**.

- Click on **New Repository** to create a new Git Repository

    ![](images/200/image017.png)  

- In the New Repository wizard enter the following information and click **Create**.

    **Name:** `AlphaofficeDB`

    **Description:** `Alphaoffice Database`

    **Initial content:** Import existing repository and enter the URL: `https://github.com/dgcameron/alphaoffice.git`

    ![](images/200/image018.png)  

- You have now created a new GIT repository based on an existing repository.

    ![](images/200/image019.png)  

## Create New MySQL Database Service

### **STEP 5**: Create new MySQL Service

Now that we have the source code in our managed GIT repository, we need to create a new MySQL Database Service.

- Click **Build** to access the build page and click **New Job**.

    ![](images/200/image020.png)

- In the New Job popup enter **Twitter Marketing UI Build** for Job Name and click **Save**.

    ![](images/200/image021.png)  

- You are now placed into the job configuration screen.

    ![](images/200/image022.png)

- Click on the **Build Parameters** tab.  We will add four parameters.

    ![](images/200/image023.png)  

    ![](images/200/image024.png)  

    ![](images/200/image025.png)

- Select the **Source Control** tab and select the AlphaofficeDB git repository.

    ![](images/200/image026.png)

- Select the **Build Steps** and specify a shell script.  Enter the following:

    `sh src/main/resources/db/setup/cr_mysql_clean.sh $USER_ID $USER_PASSWORD $ID_DOMAIN $PAAS_HOST`

    ![](images/200/image027.png)

- Select **Save** and then **Build Now**.

    ![](images/200/image028.png)

    ![](images/200/image029.png)

- The job will initially be queued and then drop down to Build History.  It will take 10 minutes to process.  When it is finished (or you can monitor while it is executing) select console and you can see the job results.  It should finish with a 'Success' message.

    ![](images/200/image030.png)

    ![](images/200/image031.png)

### **STEP 6**: Instantiate data to Version 1

We now have an empty database.  We need to populate it with baseline data.  We will use Flyway to version the data and create a baseline set of data.  Oracle Developer Cloud Service supports and encourages the use of Open Source solutions such as Flyway.

- This is how [Flyway](https://flywaydb.org/getstarted/howworks) works:

    ![](images/200/image031.1.png)

    ![](images/200/image031.2.png)    

- In our case our initial run of Flyway will do the following:
    - Create schemas (AlphaofficeDB and AlphaofficeDB_Dev)
    - Create schema_version tables in the schemas
    - Execute the SQL Scripts sequentially starting at V01__ (default for Flyway)

- Review Script **V01__AlphaofficeDB_init.sql** - go to code, and then drill down to the migration folder and select the file.

    ![](images/200/image031.3.png)  

    ![](images/200/image031.4.png)

- Next create a build job that will run the Flyway plug-in to Maven.  Navigate to Build.

    ![](images/200/image031.5.png)

- Create a new job with the following specified:
    - **Main:**
        - **Name:** `Apply Alphaoffice Database Versions`
        - **Description:** `Apply Flyway database updates`
        - **JDK:** 'JDK 8'
    - **Build Parameters:**   
        - **flyway_user:** `root`
        - **USER_PASSWORD:** `<your assigned password>`
        - **flyway_password:** `<your assigned MySQL Database password>`
        - **flyway_driver:** `com.mysql.cj.jdbc.Driver`
        - **flyway_url_prefix:** `jdbc:mysql://`
        - **flyway_schemas:** `AlphaofficeDB`
        - **db_ip:** `<your MySQL Database public IP>`
        - **db_port:** `1521`

    - **Source Control:** git repository `AlphaofficeDB.git`

    - **Build Steps:** `Execute Shell`

        mvn clean compile -Dflyway.user=${flyway_user} -Dflyway.password=${flyway_password} -Dflyway.url=${flyway_url_prefix}${db_ip}:${db_port}?useSSL=false -Dflyway.driver=${flyway_driver} -Dflyway.schemas=${flyway_schemas} flyway:migrate &

        pid=$!

        sleep 120

        kill $pid

        mvn clean compile -Dflyway.user=${flyway_user} -Dflyway.password=${flyway_password} -Dflyway.url=${flyway_url_prefix}${db_ip}:${db_port}?useSSL=false -Dflyway.driver=${flyway_driver} -Dflyway.schemas=${flyway_schemas}_Dev flyway:migrate &

        pid=$!

        sleep 120

        kill $pid

- This is how the Build Step should look:

    ![](images/200/image031.5.1.png)

    ![](images/200/image031.5.2.png)

- Note this actually runs Maven/Flyway twice - once to create the test database AlphaofficeDB, and again to create/simulate a local development database AlphaofficeDB_Dev.
- Run the Build Job:

    ![](images/200/image031.6.png)

- Review the job results:

    ![](images/200/image031.7.png)

    ![](images/200/image031.8.png)                  

# Apply Changes to MySQL Database Service

## Clone Project to Eclipse IDE

### **STEP 7**: Load Eclipse IDE
- VNC/Login into the client image and double click on the Eclipse IDE icon on the desktop.

    ![](images/200/image032.png)

- Close the welcome window.

    ![](images/200/image032.1.png)

### **STEP 8**: Create Connection to Developer Cloud Service
- We will now create a connection to the Developer Cloud Service. To do this, first click on the menu options Window -> Show View ->Other

    ![](images/200/image034.png)

- Enter oracle in the search field. Select Oracle Cloud, and click on OK.

    ![](images/200/image035.png)

- Click on Connect in the Oracle Cloud tab

    ![](images/200/image036.png)

- Enter the following information:
    - **Identity Domain:** `<your identity domain>`
    - **User name:** `<your assigned username>`
    - **Password:** `<your assigned ID Domain password>`
    - **Connection Name:* `OracleConnection`

    ![](images/200/image037.png)

- If prompted, enter and confirm a Master Password for the Eclipse Secure Storage. In our example we use the password of oracle. Next, press OK.  If prompted to enter a Password Hint, click on No.

    ![](images/200/image033.png)

### **STEP 9**: Create a local clone of the repository
- Expand Developer, and then double click on Twitter Feed Marketing
Project to activate the project.

    ![](images/200/image038.png)

- Expand the Code, and double click on the Git Repo
[AlphaofficeDB.git], to cause the Repo to be cloned locally.

    ![](images/200/image039.png)

- Import Projects - navigate to the top left file menu and select Import Projects.

    ![](images/200/image040.png)

- Expand the git menu item and select Projects from Git.

    ![](images/200/image040.1.png)

- Select the AlphaofficeDB git repository.

    ![](images/200/image040.3.png)

- Take the defaults

    ![](images/200/image040.4.png)

- Take defaults.

    ![](images/200/image040.5.png)

## Test the Local Cloned Services

### **STEP 10**: Set Feature 1 Status to In Progress

In the previous steps we updated the status of the Tasks assign to Roland Dubois using the web interface to the Developer Cloud Service. In this step we will use the Eclipse connection to the Developer Cloud Service to update the status of Roland’s tasks.

- Within the Oracle Cloud Connection tab, double click the Issues to expand, then double click on Mine to expand your list. Once you see the list of your Issues, then double click on Update Database.

    ![](images/200/image042.png)

- Scroll down to the bottom of the Update Database window. In the Actions section, and change the Actions to Accept (change status to ASSIGNED), then click on Submit.

    ![](images/200/image043.png)

- Optionally, if you return to the Developer Cloud Service web interface, you’ll see that the Eclipse interface caused the Feature 1 to be moved to the “In Progress” column of the Agile > Active Sprints.

## Update Database

### **STEP 11**: Create Database Connection

- Open perspective Database

    ![](images/200/image044.png)

- Right click on Database Connections and select new.

    ![](images/200/image045.png)

- Select MySQL, then Next.

    ![](images/200/image046.png)

- Select New Driver Definition

    ![](images/200/image047.png)

- Select MySQL JDBC Driver, version 5.1, then select the JAR tab.

    ![](images/200/image048.png)

- Clear the existing Jar file.

    ![](images/200/image049.png)

- Add Jar/Zip file.

    ![](images/200/image050.png)

- Navigate to oracle/mysql-connector-java-5.1.41 and select the .jar file.

    ![](images/200/image051.png)

- Select Properties and update the values as follows:
    - **Connection URL:** `jdbc:mysql:<your MySQL IP>:1521/AlphaofficeDB_Dev`
    - **Database Name:** `AlphaofficeDB_Dev`
    - **Driver Class:** `leave existing values`
    - **Password:** `<your assigned MySQL password>`
    - **User ID:** `root`

    ![](images/200/image052.png)

    ![](images/200/image053.png)

### **STEP 12**: Apply Updates

The required updates are sitting in a versioned Flyway file in a backup directory in the git repository.  We will apply these updates to the AlphaofficeDB_Dev database, confirm the changes are correct, and later apply them to the AlphaofficeDB test database.

- Navigate back to the Resource/Project view, and expand the git repository to the backup folder.

    ![](images/200/image054.png)

- Right click and select open in editor.

    ![](images/200/image055.png)

- Set the Connection Profile.
    - **Type:** `MySQL_5.1`
    - **Name:** `New MySQL`
    - **Database:** `AlphaofficeDB_Dev`

    ![](images/200/image056.png)

- Select the sql, right click, and execute all.

    ![](images/200/image057.png)

- Review results of updates. 
    - Enter `select * from PRODUCTS` in the sql window, hightlight the sql and select `Execute All`.

    ![](images/200/image058.png)

- Maximize the results windows to review the query results.  Note that there is a new `Twitter Tag` column and it has been populated with a product hash tag.

    ![](images/200/image059.png)

- Resize the results region (hover over and drag the region boundry to the left), and scroll over to to the right to view the new column.

    ![](images/200/image060.png)

- Copy the V002__AlphaofficeDB_twitterfeed.sql file to the migaration folder.  Flyway will then pick up this new version and apply it to the test instance.  Select the Resource perspective (upper right) and then the Project Explorer panel.

    ![](images/200/image061.png)

- Right Click on file V002__AlphaofficeDB_twitterapp.sql and paste into the migration folder, where it will eventually get picked up by Flyway and deployed to the test MySQL instance.

    ![](images/200/image062.png)

# Create a new Branch and Commit Code

## Create a Branch and Commit Code

### **STEP 13**: Create a new Branch and Commit Code

- To create a new branch in the Git repository, right click on AlphaofficeDB.git and then Select Team > Switch To > New Branch.

    ![](images/200/image067.png)

- In popup window, **enter** `Feature2` for branch name and click **OK**.

    ![](images/200/image068.png)

- Add file to index.  

    ![](images/200/image063.png)


- We can now commit our code to the branch by Right Clicking on AlphaofficeDB.git and then selecting Team > Commit

    ![](images/200/image069.png)

- Enter “Feature2: Applied database updates for twitterfeedapp” in the Commit Message box, and click on Commit and Push. Note: it is possible to change the default Author and Committer to match the current “persona.” However, for the sake of this lab guide, we will leave the defaults.

    ![](images/200/image064.png)

- Enter commit message and Commit and Push.

    ![](images/200/image065.png)

    ![](images/200/image066.png)

    ![](images/200/image066.1.png)

    ![](images/200/image066.2.png)

### **STEP 14**: Complete the Database Updates Task

- In the Eclipse Task List, double click on Update Database task.

    ![](images/200/image070.png)

- In the Update Database window, scroll down to the Actions Section. Click on Resolve as FIXED,  and then click on the Submit button.

    ![](images/200/image071.png)

### **STEP 15**: Review Sprint Status and create Merge Request

- Return to the Developer Cloud Service Dashboard in the browser, and select Agile. If your default Board is not set to Microservices, then set the Find Board Filter to All, and select the Microservices board.

- Click on Active Sprints button. Notice that Feature 2 is now in the Verify Code column.

    ![](images/200/image072.png)

- Next, on navigation panel click Code, select the Feature2 branch and then click on the Commits sub tab. Now view the recent commit made to branch from within Eclipse.

    ![](images/200/image073.png)

    ![](images/200/image074.png)

- Now that Roland Dubois has completed the task of adding the search filter, a Merge Request can be created by Roland and assigned to Lisa Jones. Click on the Merge Requests, and then click on the New Request button.

    ![](images/200/image075.png)

- Enter the following information into the New Merge Request and click Next:
    - **Repository:** `AlphaofficeDB`
    - **Target Branch:** `master`
    - **Review Branch:** `Feature2`

    ![](images/200/image076.png)

- Enter the following information into Details and click Create:
    - **Summary:** `Merge Feature 2 into master`
    - **Reviewers:** `<assigned user>`

    ![](images/200/image077.png)

- In the Write box, enter the following comment and then click on the Comment button to save: “I have applied Alphaoffice Database Updates".

** Merge the Branch

In the following steps “Lisa” will merge the branch created by "Roland" into the master.

### **STEP 16**: Merge Requests

- Before moving forward, “Lisa Jones” can take a look at the Burndown and Sprint Reports by clicking on the Agile navigation, Microservices Sprint, then the Reports button.

    ![](images/200/image078.png)

- Select Sprint report.

    ![](images/200/image079.png)

- On navigation panel click Merge Requests. click on the Merge Feature 2 into master assigned request.

    ![](images/200/image080.png)

- Once the request has loaded, select the Changed Files tab. “Lisa” will now have the opportunity to review the changes in the branch, make comments, request more information, etc. before Approving, Rejecting or Merging the Branch.  Click on the Merge button.

    ![](images/200/image081.png)

- Leave the defaults, and click on the Merge button in the confirmation dialog.

    ![](images/200/image082.png)

- Now that the code has been committed to the Developer Cloud Service repository, the build and deployment will automatically start. On the navigation panel click Build, and you should see a Apply Alphaoffice Database Versions Build in the Queue.  Navigate to build and review jobs.  Click on the job.

    ![](images/200/image083.png)

- Then click on the latest build and review the console output.

    ![](images/200/image084.png)

- You should see the migration of the latest updates at the bottom of the script.

    ![](images/200/image085.png)

### **STEP 17**: Optional - review data Eclipse

- Open Eclipse in your client image.  Select the Database Development perspective and edit the existing database connection to switch from AlphaofficeDB_Dev to AlphaofficeDB.  This is the test instance that was updated when you commited the branch to master.

    ![](images/200/image086.png)

- Remove the _Dev from the database/schema name:

    ![](images/200/image087.png)

    ![](images/200/image088.png)

- Right click on the connection and select connect.


    ![](images/200/image089.png)

- Expand the database and review the schema_versions data.  Note the migrations.

    ![](images/200/image090.png)

    ![](images/200/image091.png)

- Select the PRODUCTS table and note the new populated twitter_tag column.

    ![](images/200/image092.png)

    ![](images/200/image093.png)