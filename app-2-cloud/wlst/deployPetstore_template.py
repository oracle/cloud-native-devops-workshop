print "************************ Create resources for PETSTORE application *****************************************"
datasource_user='petstore'
datasource_password=encrypt('@database.dba.pass@')
adminserver='AdminServer'
cluster_name='petstore_cluster'
JDBCURL='jdbc:oracle:thin:@localhost:1521/@database.pdb@'

connect('weblogic','welcome1','t3://localhost:7001')


edit()

startEdit()

cd('/')
cmo.createJDBCSystemResource('PETSTORE')

cd('/JDBCSystemResources/PETSTORE/JDBCResource/PETSTORE')
cmo.setName('PETSTORE')

cd('/JDBCSystemResources/PETSTORE/JDBCResource/PETSTORE/JDBCDataSourceParams/PETSTORE')
set('JNDINames',jarray.array([String('jdbc/PetstoreDB')], String))

cd('/JDBCSystemResources/PETSTORE/JDBCResource/PETSTORE/JDBCDriverParams/PETSTORE')
cmo.setUrl(JDBCURL)
cmo.setDriverName('oracle.jdbc.xa.client.OracleXADataSource')
cmo.setPasswordEncrypted(datasource_password)

cd('/JDBCSystemResources/PETSTORE/JDBCResource/PETSTORE/JDBCConnectionPoolParams/PETSTORE')
cmo.setTestTableName('SQL SELECT 1 FROM DUAL\r\n\r\n')

cd('/JDBCSystemResources/PETSTORE/JDBCResource/PETSTORE/JDBCDriverParams/PETSTORE/Properties/PETSTORE')
cmo.createProperty('user')

cd('/JDBCSystemResources/PETSTORE/JDBCResource/PETSTORE/JDBCDriverParams/PETSTORE/Properties/PETSTORE/Properties/user')
cmo.setValue(datasource_user)

cd('/JDBCSystemResources/PETSTORE/JDBCResource/PETSTORE/JDBCDataSourceParams/PETSTORE')
cmo.setGlobalTransactionsProtocol('TwoPhaseCommit')

cd('/JDBCSystemResources/PETSTORE')
set('Targets',jarray.array([ObjectName('com.bea:Name=' + cluster_name + ',Type=Cluster')], ObjectName))

save()

activate()

print "************************ Deploy PETSTORE application *****************************************"

deploy('jsf','/u01/wins/wls1036/wlserver_10.3/common/deployable-libraries/jsf-2.0.war',targets=cluster_name, stageMode='nostage', libraryModule='true')


deploy('Petstore','petstore.12.war',targets=cluster_name, stageMode='nostage')
startApplication('Petstore')

dumpStack()

