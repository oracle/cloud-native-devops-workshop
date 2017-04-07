# Exercise 5: Create and Mount Block Volume Storage

Step1: Navigate to the Storage tab on top right hand corner and click on Create Block Volume.    

![exercise5-image1](https://cloud.githubusercontent.com/assets/15100739/24787194/e519f3f2-1b1b-11e7-8e6b-245c28fd0010.PNG)
 
Step 2: Click on Create Block Volume that opens the window below and fill in the appropriate information as below. Make sure that your block volume is in the same AD as your instance. You can choose a 256.0 GB volume for this lab. Click Create Block Volume.    

![exercise5-image2](https://cloud.githubusercontent.com/assets/15100739/24787204/f2495cb6-1b1b-11e7-911c-140502239e80.PNG)

Step 3: Once the Block Volume is created, you can attach it to the VM instance you just launched. Go to the Compute instance tab, and navigate to the VM instance and click on the Attach Block Volume button. Select the block volume you created earlier from the drop down and click on attach. 

![exercise5-image3](https://cloud.githubusercontent.com/assets/15100739/24787212/fcbfb5fa-1b1b-11e7-8b89-89c7ae0e5ebd.PNG)

Note: For the purpose of this lab, leave the “Require CHAP Credentials” box unchecked. In customer scenarios, this provides added authentication to attach the volume with an instance.   

![exercise5-image4](https://cloud.githubusercontent.com/assets/15100739/24787225/097614f6-1b1c-11e7-89ad-1cbf971b64cc.PNG)

Step 4: Once the block volume is attached, you can navigate to view the iSCSI details for the volume in order to connect to the volume. It takes a minute for the volume to complete attaching. More details on connecting to volume is in our docs (https://docs.us-az-phoenix-1.oracleiaas.com/Content/Block/Tasks/connectingtoavolume.htm?Highlight=mounting%20block%20volume)

Click on the ellipsis and then click iSCSI Command and Information link. Connect to the instance through SSH and run the iSCSI commands as provided in the ISCSI Command and Information link shown below. The first two commands are for configure iSCSI and the last one is for logging to iSCSI. Do not proceed without connecting to the volume! Run these commands one at a time. 

![exercise5-image5](https://cloud.githubusercontent.com/assets/15100739/24787234/14bd0306-1b1c-11e7-869e-2ed2bf2759eb.PNG)

Step 5: You can now format (if needed) and mount the volume. To get a list of mountable iSCSI devices on the instance, run the following command:

[opc@MEAN-VM ~]$ sudo fdisk -l

Run the following commands

[opc@ MEAN-VM ~]$ sudo mkfs -t ext4 /dev/sdb
Press y when prompted 
[opc@ MEAN-VM ~]$ sudo mkdir /mnt/home
[opc@ MEAN-VM ~]$ sudo mount /dev/sdb /mnt/home
