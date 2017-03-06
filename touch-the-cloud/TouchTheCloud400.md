![](images/200/Accelerate-Process-Cloud.jpg)  


## Introduction

This is the analytics part of the  **Oracle Public Cloud Touch the Cloud workshop.** This workshop will walk you through the analytics of the  of a typical Quote to Order process.

## Objectives

- Business Analytics Process Cloud

# 

## Requirements for this lab

A deployed process 'Quote to Order' - see Required Environment Setup(TouchTheCloud000.md)

# 

## Process Cloud Business Analytics

In this section we are going to configure the Quote to Order process to gather statics while in flight.

Each step identify the role, and what the user in the specific role try to achieve. 

### **STEP 1**: Instance Analytics

---

**Role: Mr X, Process Owner**

![](images/personas/roger_frezia_sales_director.png)

  Roger Frezia, sales director and process owner wants to see what is happening to his Quote to Order processes, in a summarized customized view. 
  
---

- Logout of PCS, if not already logged in as Mr. X, and log into the Process Workspace as Mr X.

- On the Process home page click the View Dashboards

   ![](images/400/Picture1.png)

- On the following page, you will see two categories, Process Monitoring and Business Analytics.

    ![](images/400/Picture2.png)

    Feel free to look at your current Processes, by clicking on the Open, Workload, Trend and Close graphs.

    Sample Trend Graph:

    ![](images/400/Picture3.png)

    In the next section we are going to define what should be capture for each process instance, to be used in the business analytics graphs/reports.

### **STEP 2**: Defining Analytics Measures

---

**Role: Mr X, Process Owner**

![](images/personas/roger_frezia_sales_director.png)

  Roger Frezia, sales director and process owner wants extract the value of quotes per date

---

- Open your Space and Application in PCS Composer. If unsure look at **Lab 200** - **STEP 3** and **STEP 4** how to get to your clonred application from **Lab 200**.

- Click on the Indicators tab

    ![](images/400/Picture4.png)

- In this step we are going to create a measure and dimension.
   - Click on the white plus sign, next to Search, and create a Measure (quoteTotal on quoteTotal) and Dimension (quoteDate on quoteDate)

     ![](images/400/Picture5.png)

     ![](images/400/Picture6.png)

     ![](images/400/Picture7.png)

- Next step is deploy the changed application. Click on Publish

![](images/400/Picture8.png)

- Create a new snapshot to deploy

![](images/400/Pictures9.png)

- Click on Deploy

![](images/400/Pictures10.png)






