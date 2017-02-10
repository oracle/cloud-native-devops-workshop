
![](images/100/Picture100-lab.png)  
Update: January 28, 2017

## Introduction

This is the first of several labs that are part of the **Oracle Public Cloud DevOps Cloud Native Microservices workshop.** This workshop will walk you through the Software Development Lifecycle (SDLC) for a Cloud Native project that will create and use several Microservices.

You will take on 3 Personas during the workshop. The **Project Manager Persona** will create the projects, add tasks and features to be worked on, and assign tasks to developers.  The Project Manager will then start the initial sprint. The Java Developer persona will develop a new twitter feed service that will allow for retrieval and filtering of twitter data. The **JavaScript Developer** persona will develop a new Twitter Marketing UI that will display the twitter data to allow for analysis.  During the workshop, you will get exposure to Oracle Developer Cloud Service and Oracle Application Container Cloud Service.

Please direct comments to: Dennis Foley (dennis.foley@oracle.com)

## Objectives
- Create Initial Project
    - Add Users to Project
- Create Product Issues
    - Create Issues for Twitter Feed Microservice
    - Create Issues for Twitter Feed Marketing UI
- Create Agile Board and initial Sprint
- Add Issues to Sprint

## Required Artifacts
- The following lab requires an Oracle Public Cloud account that will be supplied by your instructor.


# Create Twitter Feed Marketing Project

## Create Developer Cloud Service Project

### **STEP 1**: Login to your Oracle Cloud Account
- From any browser, go to the URL:
    `https://cloud.oracle.com`

- click **Sign In** in the upper right hand corner of the browser

    ![](images/100/Picture100-1.png)

- **IMPORTANT** - Under my services, ***ask your instructor*** which **Region** to select from the drop down list, and click on the **My Services** button.

    ![](images/100/Picture100-2.png)

- Enter your identity domain and click **Go**.

    **NOTE:** The **Identity Domain, User Name** and **Password** values will be given to you by the instructor.

    ![](images/100/Picture100-3.png)

- Once your Identity Domain is set, enter your User Name and Password and click **Sign In**

  **NOTE:** For this lab you will assume the role of Project Manager ***Lisa Jones***. If your own Corporate or Trial account does not easily allow you to have multiple users, simply log into the account using your credentials, and when required you can make the “logical” change from Project Manager to other personas, even though you will always be logged in as the same user.

    ![](images/100/Picture100-3.5.png)

- You will be presented with a Dashboard displaying the various cloud services available to this account.

    ![](images/100/Picture100-4.png)

- If all your services are not visible, **click** on the **Customize Dashboard**, you can add services to the dashboard by clicking **Show.** If you do not want to see a specific service click **Hide**

    ![](images/100/Picture100-5.png)

### **STEP 2**: Login to Developer Cloud Service

Oracle Developer Cloud Service provides a complete development platform that streamlines team development processes and automates software delivery. The integrated platform includes an issue tracking system, agile development dashboards, code versioning and review platform, continuous integration and delivery automation, as well as team collaboration features such as wikis and live activity stream. With a rich web based dashboard and integration with popular development tools, Oracle Developer Cloud Service helps deliver better applications faster.

- From the Cloud UI dashboard click on the **Developer** service. In our example, the Developer Cloud Service is named **developer99019**.

    ![](images/100/Picture100-6.png)

- The Service Details page gives you a quick glance of the service status overview.

    ![](images/100/Picture100-7.png)

- Click **Open Service Console** for the Oracle Developer Cloud Service. The Service Console will list all projects for which you are currently a member.

    ![](images/100/Picture100-8.png)

### **STEP 3**: Create Developer Cloud Service Project

- Click **New Project** to start the project create wizard.
- On Details screen enter the following data and click on **Next**.

    **Name:** `Twitter Feed Marketing Project`

    **Description:** `Project to gather and analyze twitter data`

    **Note:** A Private project will only be seen by you. A Shared project will be seen by all Developer Cloud users. In either case, users need to be added to a project in order to interact with the project.

    ![](images/100/Picture100-9.png)

- Leave default template set to **Empty Project** and click **Next**

    ![](images/100/Picture100-10.png)

- Select your **Wiki Markup** preference to **MARKDOWN** and click **Finish**.

    ![](images/100/Picture100-11.png)

- The Project Creation will take about 1 minute.

    ![](images/100/Picture100-12.png)

- You now have a new project, in which you can manage your software development.

    ![](images/100/Picture100-13.png)

## Add Team Members (Owners) to the Project

### **STEP 4**: Add Team Owners to the Project

**Note:** As previously mentioned, ***if you are not allowed to have multiple users in your Corporate or Trial accounts, you will skip step 4.*** When in subsequent steps/labs you are asked to log in as different users responsible for different roles, you will physically perform the tasks as the same user, but you should mentally assume the role of a different persona.

- Click on the **Team** icon ![](images/100/TeamIcon.png) found on the far right side of the window.

- To add new Team Members, click **New Member**

    ![](images/100/Picture100-14.png)

- Set the Role to **Owner**, and enter the Username **bala.gupta**, and then click **Add**

- Repeat the process for Username **john.dunbar**. When completed your team should consist of 3 members.

    ![](images/100/Picture100-15.png)

# Create Product Issues

## Create Issues for Twitter Feed Microservice

### **STEP 5**: Create Issue for the initial GIT Repository Creation

In this step you are still connected in the logical role of the Project Manager, ***Lisa Jones***.

- Click **Issues** on left hand navigation panel to display the Track Issues page.

    ![](images/100/Picture100-16.png)

- Click **New Issue**. Enter the following data in the New Issue page and click **Create Issue**.

    **Note:** no matter who you assign as the task “physical” owner, for the sake of this workshop, **Bala Gupta** will be the “logical” owner. The same concept holds true for other assignments made in this lab.

    **Summary:**
    `Create Initial GIT Repository for Twitter Feed Service`

    **Description:**
    `Create Initial GIT Repository for Twitter Feed Service`

    **Type:** `Task`
    **Owner:** `Bala Gupta (or you, if another user is not available)`
    **Story Points:** `1`

    Note: Story point is an arbitrary measure used by Scrum teams. This is used to measure the effort required to implement a story. To learn more: https://agilefaq.wordpress.com/2007/11/13/what-is-a-story-point/

    ![](images/100/Picture100-17.png)

### **STEP 6**: Create Issue for Update Twitter Credentials

- Click **New Issue**. Enter the following data in the New Issue page and click **Create Issue**.

    **Summary:** `Create Filter on Twitter Feed`

    **Description:** `Create Filter to allow user to supply text to reduce the amount of data returned by the Twitter feed`

    **Type:** `Feature`

    **Owner:** `Bala Gupta (or you if another user is not available)`

    **Story Points:** `2`

    ![](images/100/Picture100-18.png)

### **STEP 7**: Create Issue for initial GIT Repository creation

- Click **New Issue**. Enter the following data in the New Issue page and click **Create Issue**.

    **Summary:** `Create Initial GIT Repository for Twitter Feed Marketing UI`

    **Description:** `Create Initial GIT Repository for Twitter Feed Marketing UI`

    **Type:** `Task`

    **Owner:** `John Dunbar (or you if another user is not available)`

    **Story Points:** `1`

    ![](images/100/Picture100-19.png)

### **STEP 8**: Create Issue for Displaying Twitter Feed

- Click **New Issue**. Enter the following data in the New Issue page and click **Create Issue**.

    **Summary:** `Display Twitter Feed in Table Format`

    **Description:** `Display Twitter Feed in Table Format`

    **Type:** `Feature`

    **Owner:** `John Dunbar`

    **Story Points:** `2`

    ![](images/100/Picture100-20.png)

- Click ![](images/100/Picture100-21.png) on the **left side** of the window, or click on the **Issues** menu option to view all newly created issues.

    ![](images/100/Picture100-22.png)

# Create Agile Board

## Create Agile Board and Initial Sprint

### Developer Cloud Service Agile Page Overview

Before you start using the Agile methodology in Oracle Developer Cloud Service, it is important that you know the following key components of the Agile page.

- **Board** – A Board is used to display and update issues of the project. When you create a Board, you associate it with an Issue Query. The Board shows Issues returned by the Query.
You can either use a Board created by a team member, or create your own Board. You can create as many Boards as you like.
- **Sprint** – A Sprint is a short duration (usually, a week or two) during which your team members try to implement a product component.
You add the product component related issues to a Sprint. When you start working on a product component, you start (or activate) the related Sprints. To update issues using a Sprint, you must first activate the Sprint and add the Sprint to the Active Sprints view.
- **Backlog view** – Lists all Issues returned by the Board’s Query. The view also displays all active and inactive Sprints of the Board, and the sprints from other Boards that contain Issues matching the Board’s Query.
Each Sprint lists issues that are added to it. The Backlog section (the last section of the Backlog page) lists all open issues that are not part of any Sprint yet. The Backlog view does not show the resolved and closed Issues.
- **Active Sprints view** – Lists all active Sprints of the Board and enables you to update an Issue status simply by dragging and dropping it to the respective status columns.
- **Reports view** – select the Burndown Chart tab to display the amount of work left to do in a Sprint or use the Sprint Report tab to list open and completed Issues of a Sprint.

### **STEP 9**: Create Agile Board

- Click **Agile** on the Left Side Menu to display a page listing all existing Boards

    ![](images/100/Picture100-23.png)

- Click **New Board** and enter the following data. When done click **Create**.

  **Name:** `Microservices`

  **Estimation:** `Story Points`

    ![](images/100/Picture100-24.png)

### **STEP 10**: Create Sprint
- We will now create our first Sprint. Click **New Sprint**. Enter the following data and click **OK.**

    **Name:** `Sprint 1 - Initial Development`

    **Story Points:** `6`

    ![](images/100/Picture100-25.png)

### **STEP 1**:	Add Backlog Issues to Sprint

- Next we want to add the backlog issues to the newly created spring. **Drag and drop** the **4 issues** one at a time upward onto the **Sprint 1** section. This will add the issues to the sprint.

    ![](images/100/Picture100-26.png)

    ![](images/100/Picture100-27.png)

## Customize Agile Board

### **STEP 12**: Customize Board

In the following step you will customize an Agile Board, and add a new Progress State. If you desire more information about States and Conditions, the following link will provide a tutorial: http://www.oracle.com/webfolder/technetwork/tutorials/obe/cloud/developer/AgileDevelopment/AgileDevelopment.html

- Now we will show you how you can customize your board. In the right hand side click **Board -> Configure**

    ![](images/100/Picture100-28.png)

  **Note**: Before we create a new progress state, we want to un-assign some of the conditions that will be used in the new state. You can’t add new conditions or removed conditions, however, you can redefine progress states to suit your project’s needs and move conditions from one state to another. A large number of conditions are assigned to the Completed state by default.

- Click on **:Progress States**: then click **:Completed**: state. In the lower left panel of the window, scroll down the conditions and select all the **:RESOLVED conditions**:.  Click ![](images/100/PictureGreater.png) to move them over to Unassigned Conditions panel

    ![](images/100/Picture100-29.png)

- Click **:New Progress State**:.  Change name to **:Verify Code**:. We will use this new State for performing QA and Testing.

    ![](images/100/Picture100-30.png)

- Highlight all the **:RESOLVED**: unassigned conditions, and click ![](images/100/PictureLess.png) to move them over to the Conditions column.

    ![](images/100/Picture100-31.png)

- With **:Verify Code**: highlighted, click ![](images/100/PictureUpArrow.png) to move **:Verify Code**: above the Completed Process State.

    ![](images/100/Picture100-32.png)

- Click **Save** to persist change.

    ![](images/100/Picture100-33.png)

### **STEP 13**: Start Sprint

- Click **Start Sprint.** Leave the defaults and click **Start**

    ![](images/100/Picture100-34.png)

- Now click on **Active Sprints** to view the Sprint Dashboard

    ![](images/100/Picture100-35.png)

- Click on the **Reports** button to view the Burndown and Sprint reports.

    ![](images/100/Picture100-36.png)

- You are now ready to move to the next lab.
