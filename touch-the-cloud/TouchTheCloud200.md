![](images/200/Accelerate-Process-Cloud.jpg)  


## Introduction

This is the second of several labs that are part of the **Oracle Public Cloud Touch the Cloud workshop.** This workshop will walk you through the management, modeling and administration of a typical Quote to Order process.

## Objectives

- User Experience with Process Cloud
- Process Modeling and Configuration

# 

## Requirements for this lab

A deployed process 'Quote to Order' - see Required Environment Setup(TouchTheCloud000.md)

# 

## Process Cloud User Experience

In this section we are going to experience the interaction possible from an end user of the PCS interface.

Each step identify the role, and what the user in the specific role try to achieve. 

### **STEP 1**: Create a Quote (or follow **STEP 1a** for a manual Quote Capture)

---

**Role: John Lee, Field Sales**

![](images/personas/john_lee_field_sales.png)

On either your mobile phone, or in the Simulator in MCS, go ahead and create a Quote for a customer. This will trigger the Quote to Order process in Process Cloud.

---

### **STEP 1a**: Create a Quote Manually (***Optional***)

---

**Role: John Lee, Field Sales**

![](images/personas/john_lee_field_sales.png)

PCS supports the use of forms to submit data to be used as input for a process.

---

Follow the steps explained in steps **STEP 2**, **STEP 3** to login into the Oracle Cloud, or directly into the PCS Workspace using ***John's*** credentials instead of Julie's.

- On the PCS Workspace home page, click on the application **Submit Quote(1.0)**

  ![](images/200/Picture11.png)

- Fill in the information requested information on the form

  ![](images/200/Picture12.png)

   For the fields use the following values:
   
   Quote Number: 4325
   
   Select a customer from the following table:
   
   |CustomerNumber| CustomerName                | AddressLine1          | AddressLine2       | Phone        | FirstName | LastName | City     | Country | Zip   | Email                         | 
   | :----------- | ----------------------------| ----------------------| ------------------ | ------------ | --------- | -------- | -------- | ------- | ----- | ------------------------------|
   | 1            | ABC Telecommunications      | 1021 Fifth Avenue     | New York, NY 10022 | 917-123-2345 | Vincent   | DiNatale | New York | USA     | 10022 | v.dinatale@abctelecomms.com   |
   | 2            | MedChoice - IDN             | 333 Lexington Ave     | New York, NY 10000 | 917-123-2346 | Louis     | Wohl     | New York | USA     | 10000 | louis.wohl@medchoice.com      |
   | 3            | Bronco Drilling Machinery   | 150 East 50th Street  | New York, NY 10023 | 917-123-2347 | Jack      | Thomas   | New York | USA     | 10022 | jack.thomas@broncodrilling.com|
   | 4            | BHB Technologies            | 522 West 38th Street  | New York, NY 10018 | 917-123-2348 | Robbie    | Hun      | New York | USA     | 10018 | robbie.hun@bhbtech.com        |
   | 5            | CIC Management Inc.         | 68 Church Street      | New York, NY 10000 | 917-123-2349 | Lucy      | Leu      | New York | USA     | 10000 | lucy.leu@cicmgt.com           |
   | 6            | ABC Application Software    | 536 Madison Avenue DE | New York, NY 10012 | 917-123-2350 | Lenore    | Soifer   | New York | USA     | 10012 | lenore.soifer@abcsoftware.com |
   | 7            | Capital Investments Group   | 400 Madison Avenue    | New York, NY 10024 | 917-123-2351 | James     | Roman    | New York | USA     | 10024 | james.roman@capitalinvest.com |
   | 8            | Carbon Chemical Corporation | 502 East 81st Street  | New York, NY 10028 | 917-123-2352 | Loren     | Gab      | New York | USA     | 10028 | loren.gab@carbon_chem.com     |
   | 9            | Capp Worldwide Services Inc.| 32 Ave of the Americas| New York, NY 10013 | 917-123-2353 | Paul      | Pub      | New York | USA     | 10013 | paul.pub@cappww.com           |
   | 10           | Astro-Energy Systems        | 35 East 76th Street   | New York, NY 10021 | 917-123-2354 | Jenny     | Roy      | New York | USA     | 10021 | jenny.roy@astro_energy.com    |
   
   For the items, use some of these inventory items, using UOM (unit of measure) as 'each':
   
   | ItemNumber | Inventory Item ID | Description                        | List Price Per Unit |
   | :--------- | ----------------- | ---------------------------------- | -------------------:|
   | 1          | 155               | Sentinel Deluxe Desktop            |              1969.00|
   | 2          | 249               | Hard Drive - 250GB SSD             |              899.00 |
   | 3          | 436               | Lightning Inkjet Printer           |              300.00 |
   | 4          | 2848              | Vision Pad DX - Mobile Computer    |              249.00 |
   | 5          | 190878            | Vision Pad X100 - Mobile Computer  |              249.00 |
   | 6          | 2155              | Sentinel Standard Desktop - Rugged |              1900.00|
   | 7          | 174762            | 205 Digital Camera                 |              215.00 |
   | 8          | 12023             | Digital Camera, Professional       |              487.80 |
   | 9          | 12031             | Television 102"                    |              3749.99|
   | 10         | 12029             | Television 96"                     |              2608.69|

   - Click on the Submit button to start the Quote to Order process.

### **STEP 2**: Login to Oracle Cloud

---

**Role: Julie Jones, Field Sales**

![](images/personas/julie_jones_sales_operations.png)

Since it is Julie's first time signing into Oracle Cloud, she has to figure out how to access Oracle Process Cloud Services.

---

Now we can login as Julie Jones. From any browser, **go to the following URL**:
[https://cloud.oracle.com](https://cloud.oracle.com)

- Click **Sign In** in the upper right hand corner of the browser.

    ![](images/200/Picture2.png)  

- **IMPORTANT** - Under My Services, ask ***your instructor*** which **Region** to select from the drop down list, and **click** on the **My Services** button.

    ![](images/200/Picture3.png)  

- Enter your identity domain and click **Go**

  ***NOTE***: the **Identity Domain, User Name** and **Password** values will be given to you from your instructor.

    ![](images/200/Picture4.png)  

- Once your Identity Domain is set, enter your **User Name** and **Password** and click **Sign In**

    ![](images/200/Picture5.png)  

- Once connected, you will be presented with a Dashboard displaying the various cloud services available to this account. 

    ![](images/200/Picture6.png)  
  
- Click on the **Oracle Process Cloud Service**

    ![](images/200/Picture7.png)

- Capture the link displayed **Service Instance URL**, for most browsers right-click ***Copy Link Address***
>***Note:***
> Capture this URL, as this is going to be the direct access URL to PCS referenced in this Lab document.

> -The Process Cloud Workspace URL **Copied URL** example https://pcsinstance-domain.process.us2.oraclecloud.com/bpm/workspace

> -The Process Cloud Composer URL **Copied URL** with the "/workspace" replaced by "/composer", which results in https://pcsinstance-domain.process.us2.oraclecloud.com/bpm/composer if applied to the sample above 

### **STEP 3**: Login to Process Cloud Service

---

**Role: Julie Jones, Field Sales**

![](images/personas/julie_jones_sales_operations.png)

There are different ways to access the PCS Workspace. The direct access URL can be embedded on an Intranet page, a full set of REST API's can be used to extract the information programmatically or you can use the mobile application supplied by Oracle. 

Julie prefer to go directly to her PCS Workspace using a browser.

---

Oracle Process Cloud Service is divided as three separate functionalities, and depending on you role, you would be able to access these functionalities. The functionalities is divided in Administrator Tasks, End-User Tasks and Developer Tasks. Since Julie only has access defined as a End-User, so will only see the task relevant to her, **Work on Tasks** and **Track Instances**.

- From Cloud UI dashboard click on the **Service Instance URL** link. ***Or,*** using the captured URL open your browser to the **Copied URL**

    ![](images/200/Picture8.png)  

- The  PCS Landing page gives you a quick glance of the functionality available to you (or in this case Julie Jones).

>![](images/200/workspace_home-_-admin.png)

>The above picture gives an explanation of a page, for user with all privileges granted and shows the different roles associated with each activity.  

### **STEP 4**: Working on Tasks

---

**Role: Julie Jones, Field Sales**

![](images/personas/julie_jones_sales_operations.png)

Julie wants to look at her outstanding tasks, and approve the incoming Quote request generated in **STEP 1**. (Although she is not aware of it at the moment, PCS can be configured to send out notifications and reminders to attend to outstanding tasks).

---


- Click **Work on Tasks** to access the Task List

    ![](images/200/Picture9.png)  

    In the list we can see the outstanding tasks allocated. You also have the capability to sort, do filtering and peek at task related to 'me'.

- Select a task by hovering over the task with mouse and clicking on it.

    ![](images/200/Picture10.png) 
    >While we are on the task form, let me take the opportunity to give you a breakdown of a typical task form: 
    >1. Action Items - In this instance we have two actions defined, Approve and Reject. The Save functionality allows you to make some changes, save the state of the task and at a later stage come back to the task to complete. 
    >2. Close Form / Maximize
    >3. Documents Panel Expand, might also include Discussions, if enabled for process
    >4. Form, or also called the payload for the task. This information is the task specific information required to decide on on an action. Depending on the configuration, information can be updated.
    >5. Comments
    >6. Task Information, History and Task Metadata

- Lets follow the happy path, and click on the action ***Approve***
- The page will revert to the task list and you will notice that the task disappeared from your inbox. In fact, you might also get a green confirmation message that your action was accepted.

### **STEP 5**: Tracking Instances

---

**Role: Mr X, Process Owner**

![](images/personas/roger_frezia_sales_director.png)

Roger Frezia, sales director and process owner wants to see what happened to our process we have approved in the previous step. Since a process can be configured to follow different paths depending on rules and the way the process was modeled, it might be sometimes required for a process owner to look at a process instance to see what happened. 

This audit information can also be exported and use for debugging or as input for on-premise systems.
---

- Logout as Julie Jones, and log into the Process Workspace as Mr X.

- Click **Instance Tracking** to access the List of Instances

    ![](images/200/Picture13.png)  

    ![](images/200/Picture14.png)

    This List displays the active instances. To display completed instances as well, you have to select the **Completed** check box.

    ![](images/200/Picture15.png)

