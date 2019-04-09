package backend;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

public class CustomerViewServlet extends HttpServlet {
	private static final long serialVersionUID = -4809125939218699071L;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.sendRedirect("login.html");
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		System.out.println("Login request received: " + request.getParameter("username"));
		int result = checkUser(request.getParameter("username"), request.getParameter("password"));
		if (result == -1) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error accessing database");
		} else if (result == 0) {
			System.out.println("Incorrect authentication. Returning to login");
			response.sendRedirect("login.html");
		} else if (result == 1){
			System.out.println("User is customer. Logging in.");
			response.sendRedirect("customerView.html");
		} else {
			System.out.println("User is Prima. Logging in.");
			response.sendRedirect("primaView.html");
		}
	}
	
	private int checkUser(String user, String password) {
		if (user == "" || password == "") {
			return 0;
		}
		ResultSet rs;
		try {
			Context initial = new InitialContext();
			DataSource ds = (DataSource) initial.lookup("java:comp/env/jdbc/e1800815_CustomerLearningAnalyse");
			Statement s = ds.getConnection().createStatement();
			rs = s.executeQuery("select * from Users where Name=\"" + user + "\"");
			
			if (!rs.first()) return 0;
			if (rs.getString(2).equals(password)) {
				if (rs.getString(3).equals("0")) return 2; // Prima user
				else return 1; // Normal user
			}
		} catch (NamingException e) {
			return -1;
		} catch (SQLException e) {
			return -1;
		}
		return -0;
	}
}
