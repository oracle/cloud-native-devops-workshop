<%@ page import="java.sql.Connection"%>
<%@ page import="java.sql.DriverManager"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="java.sql.Statement"%>
<%@ page import="java.lang.*"%>
<%@ page import="java.sql.*"%>
<%@ page import="org.slf4j.Logger"%>
<%@ page import="org.slf4j.LoggerFactory"%>

<html>
<head>
<title>MySQL JDBC Execution JSP</title>
</head>
<body BGCOLOR=white>

	<%
		String jdbcurl = request.getParameter("jdbcurl");
		String dbuser = request.getParameter("dbuser");
		String dbpassword = request.getParameter("dbpassword");
		String sqlstmt = request.getParameter("sqlstmt");
		if (jdbcurl != null && dbuser != null && dbpassword != null && sqlstmt != null) {
	%>
	<h3>
		Execution results for : <i> <%=sqlstmt%>
		</I>
	</h3>
	<%=executeStmt(jdbcurl, dbuser, dbpassword, sqlstmt)%>
	<hr>
	<br>
	<%
		}
	%>

	<b>Enter parameters:</b>
	<form METHOD=get>
		<table>
			<tr>
				<th>Parameter</th>
				<th>Value</th>
			</tr>
			<tr>
				<td>JDBC connection string</td>
				<td><input type="text"
					value="jdbc:mysql://<%=System.getenv("MYSQLCS_CONNECT_STRING")%>?verifyServerCertificate=false&useSSL=false&requireSSL=false"
					size="120" name="jdbcurl"></td>
			</tr>
			<tr>
				<td>Database User</td>
				<td><input value="<%=System.getenv("MYSQLCS_USER_NAME")%>"
					type="text" size="120" name="dbuser"></td>
			</tr>
			<tr>
				<td>Database Password</td>
				<td><input type="text"
					value="<%=System.getenv("MYSQLCS_USER_PASSWORD")%>" size="120"
					name="dbpassword"></td>
			</tr>
			<tr>
				<td>SQL Statement</td>
				<td><input type="text" size="120" name="sqlstmt"></td>
			</tr>
		</table>
		<input type="submit" value="Execute">
	</form>
</body>
</html>
<%!private String executeStmt(String jdbcURL, String dbuser, String dbpassword, String sqlStmt)
			throws ClassNotFoundException {

		Logger logger = LoggerFactory.getLogger(this.getClass());
		StringBuffer sbResult = new StringBuffer();

		Class.forName("com.mysql.jdbc.Driver");
		logger.info("MySQL DRIVER found");

		try (Connection conn = DriverManager.getConnection(jdbcURL, dbuser, dbpassword);
				Statement stmt = conn.createStatement();) {

			if (stmt.execute(sqlStmt)) {
				logger.info("STMT query executed");
				ResultSet rset = stmt.getResultSet();
				sbResult.append("Query result:<br>");
				sbResult.append(formatResult(rset));
			} else {
				logger.info("STMT update executed");
				sbResult.append("Number of rows affected: ");
				sbResult.append(stmt.getUpdateCount());
				sbResult.append("<br>");
			}

			return sbResult.toString();
		} catch (Exception e) {
			logger.error("Database execution failed", e);
			return ("<p> SQL error: <pre> " + e + " </pre> </p>\n");
		}
	}

	private String formatResult(ResultSet rset) throws SQLException {
		ResultSetMetaData rsmd = rset.getMetaData();
		int columnsNumber = rsmd.getColumnCount();
		StringBuffer sb = new StringBuffer();
		if (!rset.next())
			sb.append("<p> No rows.<p>\n");
		else {
			sb.append("<table>");
			sb.append("<tr>");
			for (int i = 1; i < columnsNumber + 1; i++) {
				sb.append("<th style=\"text-align: left\">");
				sb.append(rsmd.getColumnName(i));
				sb.append("</th>");
			}
			sb.append("</tr>");
			do {
				sb.append("<tr>");
				for (int i = 1; i < columnsNumber + 1; i++) {
					sb.append("<td>");
					sb.append(rset.getString(i));
					sb.append("</td>");
				}
				sb.append("</tr>");
			} while (rset.next());
			sb.append("</table>");
		}
		return sb.toString();
	}%>