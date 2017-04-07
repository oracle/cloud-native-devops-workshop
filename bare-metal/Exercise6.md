# Exercise 6: Download and Configure MEAN Stack

For this lab, we are going to use a Bitnami MEAN Stack that provides a complete development environment for MongoDB and Node.js that can be deployed in one click. It includes the latest stable release of MongoDB, Express, Angular, Node.js, Git, PHP and RockMongo.

Step1: use the following commands to download and install the MEAN stack on Linux. The downloaded file will be named 'bitnami-mean-linux-installer.run'.

$ sudo yum install wget -y
$ wget -O bitnami-mean-linux-installer.run https://bitnami.com/stack/mean/download_latest/linux-x64

To begin the installation process, give the installer executable permissions and then execute the installation file, as shown below:

$ chmod 755 bitnami-mean-linux-installer.run
$ ./bitnami-mean-linux-installer.run
follow the prompts and install Python, Git, ImageMagic, RockMongo, PHP
provide name for a root folder for MEAN (choose any name)
provide strong password for Mongo (choose any password)
provide yes for launching Bitnami MEAN

Step 2: Enable firewall to have these ports 8080 and 3000 added

$ sudo firewall-cmd --permanent --add-port=8080/tcp
$ sudo firewall-cmd --permanent --add-port=3000/tcp
$ sudo firewall-cmd --reload

Navigate to http://<ipaddress>:8080  (the IP address of the MEAN VM) in your browser. Note that it doesn’t return anything; that’s because the Virtual Cloud Network needs to open certain ports for the MEAN stack to work.  

Step 3: click on Virtual Cloud Network and then the VCN you created above, named MEAN-VCN. Click on Security Lists on the left navigation bar for the VCN. Then click on the Default Security List for the MEAN-VCN. Here you need to open certain ports. Click on edit all rules. 

![exercise6-image1](https://cloud.githubusercontent.com/assets/15100739/24787333/a4d0d6b6-1b1c-11e7-9cb9-6d717c2226d9.PNG)
 
Step 4: click on +Add Rule twice and add the following values as shown below under the Allow Rules for Ingress. Click on Save Security List Rules at the bottom. 

![exercise6-image2](https://cloud.githubusercontent.com/assets/15100739/24787372/cc89adf4-1b1c-11e7-816b-690314a5ff21.PNG)

Navigate to http://<ipaddress>:8080  (the IP address of the MEAN VM) in your browser. Now you should see the following page: 

![exercise6-image3](https://cloud.githubusercontent.com/assets/15100739/24787382/dd1a6c94-1b1c-11e7-8cc9-679ebd156c75.PNG)

