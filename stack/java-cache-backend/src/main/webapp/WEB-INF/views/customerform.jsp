<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<link rel="stylesheet"
	href="//cdn.rawgit.com/yahoo/pure-release/v0.6.2/pure-min.css">
</head>
<body>
	<h1>Update Customer</h1>
	<form class="pure-form-aligned" action="/customerlist" method="POST">
	
		<fieldset>
			<div class="pure-control-group">
				<label>Customer ID</label> 
				<input name="id" type="text" value="${customer.id}" disabled>
				<input name="customerid" type="hidden" value="${customer.id}">
			</div>
			<div class="pure-control-group">
				<label >First Name</label>
				<input name="firstname" type="text" value="${customer.firstName}" placeholder="First Name">
			</div>
			<div class="pure-control-group">
				<label >Last Name</label>
				<input name="lastname" type="text" value="${customer.lastName}" placeholder="Last Name">
			</div>
			<div class="pure-control-group">
				<label >Username</label>
				<input name="username" type="text" value="${customer.username}" placeholder="username" disabled>
				
			</div>
			<div class="pure-control-group">
				<label >Email</label>
				<input name="email" type="text" value="${customer.email}" placeholder="username@example.com"
					disabled>
			</div>
			<div class="pure-control-group">
				<label >Mobile phone</label>
				<input name="mobile" type="text" value="${customer.mobile}" disabled>
			</div>
			<div class="pure-control-group">
				<label>Landline phone</label>
				<input name="home" type="text" value="${customer.home}" disabled>
			</div>
			<div class="pure-control-group">
				<label>Address</label>
				<input name="address" type="text" value="${customer.formattedAddress}" disabled>
			</div>			
		<input type="submit" class="pure-button pure-button-primary" value="Update">
		</fieldset>
	</form>
</body>
</html>
