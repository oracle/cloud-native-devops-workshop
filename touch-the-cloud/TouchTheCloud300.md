![](images/300/HeaderImage.png)  

Update: March 10, 2017

# Lab 300 - Integration Cloud Service

---

## Introduction

This is the third of several labs that are part of the **Oracle Touch the Cloud** workshop. 

In this lab, you will acquire a good overview of the Oracle Integration Cloud Service (ICS), then next generation integration platform. You will modify an integration to Oracle EBS. You will explore various consoles and tools available to interact with your integration. The exercise will get your familiar with all the tooling available to work with this cloud service.

Please direct comments to: John VanSant (john.vansant@oracle.com)

## Objectives

- Explore Integration Cloud Service
- Use Integration Cloud Service to modify an integration

## Required Artifacts

- The following lab an Oracle Public Cloud account that will be supplied by your instructor. You will need to download and install latest version of Brackets text editor.

# Explore Integration Cloud Service

## Login to Integration Cloud Service

### **STEP 1**: Login to your Oracle Cloud account

---

- From your browser (Firefox or Chrome recommended) go to the following URL:
https://cloud.oracle.com
- Click Sign In in the upper right hand corner of the browser
- **IMPORTANT** - Under My Services, change Data Center to `US Commercial 2 (us2)` and click on Sign In to My Services

    ![](images/300/image001.png)

- If your identity domain is not already set, enter it and click **Go** (do not check to box to save it because this will set a cookie in the browser that needs to be cleared if you need to change identity domains later)  

    **NOTE:** the **Identity Domain** values will be given to you from your instructor.

    ![](images/300/image002.png)  

- Once your Identity Domain is set, enter your `User Name` and `Password` and click **Sign In**

    ***NOTE:*** the **User Name and Password** values will be given to you from your instructor.

    ![](images/300/image003.png)  

- You will be presented with a Dashboard displaying the various cloud services available to this account.

   **NOTE:** The Cloud Services dashboard is intended to be used by the *Cloud Administrator* user role.  The Cloud Administrator is responsible for adding users, service instances, and monitoring usage of the Oracle cloud service account.  Developers and Operations roles will go directly to the service console link, not through the service dashboard.

    ![](images/300/image004.png)

### **STEP 2:**	Explore Oracle Cloud Dashboard

---

The Cloud Dashboard is the launching pad for all the cloud services in your account. You have access to the following Cloud service: **Oracle Integration Cloud Service, Oracle Process Cloud Service, Oracle Database Cloud Service, Oracle Database Backup Service, Oracle Storage Cloud Service, Oracle Compute Cloud Service, Oracle Java Cloud Service and Oracle SOA Cloud Service**.

- To look at the details for the Integration Cloud Service (ICS) instance, first click on the `hamburger` icon, then click on the `View Details` link.

   ![](images/300/image004a.png)

- The `Service Details` pages will show various important details about the ICS service instances in this identity domain such as: uptime, service start and end dates, and your Oracle Cloud subscription ID.

   ![](images/300/image004b.png)

- Access to `Business Metrics` can be found in the left-hand navigation.  Select the `Business Metrics` tab as shown below:

   ![](images/300/image004c.png)

- The `Business Metrics` page will show the total number of messages that ICS has processed and the total number of active connections currently in the subscription.

   ![](images/300/image004d.png)

- After getting familiar with the Business Metrics, select the `Open Service Console` button to go to the ICS Service Console.  

    ![](images/300/image005.png)  

- You will now be presented with the ICS Service Console from which you will be performing the rest of this workshop lab.

    ![](images/300/image006.png)  

## Explore the ICS Designer User Interface

### **STEP 1:**	Open ICS Designer

---

- **Click** on the `Designer` tab in the upper-right corner of the ICS Service Console to navigate to open the ICS Designer.

    ![](images/300/image007.png)  

- You will be presented with the ICS Designer Portal:

    ![](images/300/image008.png)  

### **STEP 2:**	Explore ICS Connections

---

- Select the `Connections` graphic in the designer portal

    ![](images/300/image009.png)  

- Make note of the connections that have been created. Notice that there are three connections, one called *EBS 12cR2*, one called *EBS DB* and the other called *Inbound SOAP*.

    ![](images/300/image010.png)  

### **STEP 3:**	Explore ICS Integrations

---

- Select the `Integrations` link from the navigation bar on the left of the Connections designer console

    ![](images/300/image011.png)  

- Make note of the integrations that have been created. We will be working with the integration called *Create EBS Order*.

    ![](images/300/image012.png)  

### **STEP 4:** Explore ICS Agents

---

- Select the `Agents` link from the navigation bar on the left of the Integrations designer console

    ![](images/300/image013.png)  

- Make note of the agent that has been created to communicate with the EBS instance, it is called *EBS_ONPREM*

   ![](images/300/image014.png)  

## Explore the ICS Monitoring User Interface

### **STEP 1:**	Open ICS Monitoring Console

---

- In the upper right corner of the ICS Portal, click the `Monitoring` tab

   ![](images/300/image015.png)

### **STEP 2:**	Explore ICS Monitoring Console Dashboard

---

- By default, you will be presented with the ICS Monitoring Dashboard.  Observe the various data that is available from this dashboard such as *% of successful messages*, *# of Connection Currently Used*, etc.

    ![](images/300/image016.png)  

### **STEP 3:**	Explore ICS Monitoring Console Tracking

---

- Select the `Tracking` link in the navigation bar on the left

**XXXX**

# Use Integration Cloud Service to Modify an Integration

## Clone an existing integration

### **STEP 1:**	Open the ICS Design Console

---

**XXXX**

## Edit the mapping to the EBS update service call

### **STEP 1:**	Deactivate the integration “Create Order EBS”

---

**XXXX**

### **STEP 2:**	Open the integration “Create Order EBS”

---

**XXXX**

### **STEP 3:**	Open the mapping “I don’t know that the mapping name is” for editing

---

**XXXX**

### **STEP 4:**	Test the updated mapping

---

**XXXX**

## Add Tracking to an integration

### **STEP 1:**	Open the “Tracking” editor

---

**XXXX**

## Save then activate changes

### **STEP 1:**	Save the integration

---

**XXXX**

### **STEP 2:**	Select the “Activate” switch

---

**XXXX**

# Testing the End to End Application
***XXXX*** D:\docs\Oracle Docs\FY17_Sales\TouchTheCloudWorkshop\Workshop\Touch-the-Cloud\touch-the-cloud\images\300

    ![](images/300/image011.png)  


