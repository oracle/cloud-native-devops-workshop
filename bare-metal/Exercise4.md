# Exercise 4: Connect to the Instance

Step 1: Once the instance state changes to Running, you can SSH to the Public IP address of the instance. Click on the MEAN-VM link and you will find the public IP address listed there. 
 
![exercise4-image1](https://cloud.githubusercontent.com/assets/15100739/24787114/3e5d8a4c-1b1b-11e7-9db1-acaea7852c4f.PNG)

Step 2: SSH to the instance and mount the Volume as provided in next section. You can use the following command to SSH into the BMCS VM on UNIX-style system (including Linux, Solaris, BSD, and OS X).

$ ssh –i </path/privateKey> <PublicIP_Address>

For windows, use a tool like PUTTY as shown below – provide the public IP address of the BMCS VM. Expand on SSH in the LHS menu, click on Auth. Click on browse, and provide the Private SSH key that you had saved earlier while generating the SSH key pair. Click on Yes in the PUTTY Security Alert window.

![exercise4-image2](https://cloud.githubusercontent.com/assets/15100739/24787126/5392465a-1b1b-11e7-8204-3b0ddf1600ea.PNG)
   
Step 3: Login with the user name opc as shown below.

![exercise4-image3](https://cloud.githubusercontent.com/assets/15100739/24787132/646f85aa-1b1b-11e7-89c9-5c570ca19f14.PNG)
