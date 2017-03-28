<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<link rel="stylesheet"
	href="//cdn.rawgit.com/yahoo/pure-release/v0.6.2/pure-min.css">
</head>
<body>
	<h1>Cache Customer list JSP</h1>
	
	<br>
	<a href="/">Back to main page</a>
	<br>

	<table class="pure-table pure-table-bordered">
		<tr>
			<th>Action</th>
			<th>Customer ID</th>
			<th>First Name</th>
			<th>Last Name</th>
			<th>Username</th>
			<th>Email</th>
			<th>Mobile phone</th>
			<th>Landline phone</th>
			<th>Address</th>
		</tr>
		<c:forEach items="${customers}" var="customer">
			<tr>
				<td><a href="customers/${customer.id}/update">Edit</a></td>
				<td>${customer.id}</td>
				<td>${customer.firstName}</td>
				<td>${customer.lastName}</td>
				<td>${customer.username}</td>
				<td>${customer.email}</td>
				<td>${customer.mobile}</td>
				<td>${customer.home}</td>
				<td>${customer.formattedAddress}</td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>
