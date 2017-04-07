# Exercise 2: Create a Virtual Cloud Network (VCN)

A Virtual Cloud Network (VCN) is a virtual version of a traditional network—including subnets, route tables, and gateways—on which your compute instances run. Customers can bring their network topology to the cloud with VCN.  Creating a VCN involves a few key aspects such as: 
•	Allocate a private IP block for the cloud (CIDR range for the VCN). Customers can bring their own RFC1918 IP addresses. 
•	Create Subnets by partitioning the CIDR range into smaller networks (sub networks for front end, back end, database) 
•	Create an optional Internet Gateway to connect VCN subnet with Internet. Instances created in this subnet will have a public IP address.
•	Create Route table with route rules for Internet access
•	Create Security Group to allow relevant ports for ingress and egress access

Step 1: After you login, navigate to the networking tab and select Virtual Cloud Networks.

![exercise2-image1](https://cloud.githubusercontent.com/assets/15100739/24786939/f094ceb6-1b19-11e7-84f2-8516b056738a.PNG)

Step 2: Create a Cloud Network by specifying a name for your VCN and selecting the “Create VIRTUAL CLOUD NETWORK PLUS RELATED RESOURCES” option. This will create a VCN, Subnets, Routing Table, Security Groups and Internet Gateway using a 10.0.0.0/16 CIDR range. Scroll to the bottom of the screen and click “create Virtual Cloud Network” button.

![exercise2-image2](https://cloud.githubusercontent.com/assets/15100739/24786989/48111492-1b1a-11e7-9287-ab1d1e399ac1.PNG) 

Once the VCN is created, navigating to list of VCN’s, you can see the “MEAN-VCN”, which you just created in the step above.
 
![exercise2-image3](https://cloud.githubusercontent.com/assets/15100739/24786998/51c5ed6e-1b1a-11e7-80a3-420096480eab.PNG)
