package backend;

import java.io.IOException;
import java.sql.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.StringTokenizer;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

public class Db extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private DataSource ds;
	private static final String USERSANDMACHINES = "SELECT c.name, m.Owner, m.Name FROM Machines m, Countries c, Users u WHERE c.`alpha-2`=u.Country AND u.Name=m.Owner;";
	private static final String TRENDTIMES = "SELECT Date, Running, Machine FROM Times ORDER BY Machine, Date";

	public void init() {
		try {
			Context initial = new InitialContext();
			ds = (DataSource) initial.lookup("java:comp/env/jdbc/e1800815_CustomerLearningAnalyse");
		} catch (NamingException e) {
			throw new RuntimeException(e.toString());
		}
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String country = request.getParameter("country");
		String user = request.getParameter("user");
		String machine = request.getParameter("machine");

		System.out.println("GET incoming: country=" + country + "&user=" + user + "&machine=" + machine);

		if (country == null || user == null || machine == null)
			throw new IllegalArgumentException("One of GET parameters is null");

		String result = "";
		ResultSet rs = null;

		if (country.equals("")) { // All names and users

			try {
				rs = queryDatabase(USERSANDMACHINES);
				String currentCountry = "", currentUser = "";
				while (rs.next()) {
					if (!currentCountry.equals(rs.getString(1))) {
						currentCountry = rs.getString(1);
						currentUser = rs.getString(2);
						result += "\n" + currentCountry + ";" + currentUser;
					} else if (!currentUser.equals(rs.getString(2))) {
						currentUser = rs.getString(2);
						result += ";" + currentUser;
					}
					result += "," + rs.getString(3);
				}
				result = result.substring(1);
			} catch (SQLException ex) {
				error(response, ex);
			}

		} else if (country.equals("All")) { // All times, used to do the trend curve

			try {
				rs = queryDatabase(TRENDTIMES);
				result = processData(rs);
			} catch (SQLException ex) {
				error(response, ex);
			}

		} else { // Averages, machine data or machine names for a user

			if (user.equals("")) { // Country average
				try {
					rs = queryDatabase("SELECT Date, Running, Machine FROM Times WHERE Machine IN "
							+ "(SELECT ID FROM Machines WHERE Owner IN " + "(SELECT Name FROM Users WHERE Country IN "
							+ "(SELECT `alpha-2` FROM Countries WHERE name='" + country
							+ "'))) ORDER BY Machine, Date;");
					result = processData(rs);
				} catch (SQLException ex) {
					error(response, ex);
				}

			} else {
				if (machine.equals("names")) { // Machine names
					try {
						rs = queryDatabase("SELECT Name FROM Machines WHERE Owner='" + user + "'");
						while (rs.next()) {
							result += rs.getString(1) + ";";
						}
						result = result.substring(0, result.length() - 1);
					} catch (SQLException ex) {
						error(response, ex);
					}

				} else { // Averages or machine data (can be calculated with the same algorithm)
					if (machine.equals("")) { // User average
						try {
							rs = queryDatabase(
									"SELECT Date, Running, Machine FROM Times WHERE Machine IN (SELECT ID FROM Machines WHERE Owner='"
											+ user + "') ORDER BY Machine, Date;");
						} catch (SQLException ex) {
							error(response, ex);
						}
					} else { // Individual machine
						try {
							rs = queryDatabase("SELECT Date, Running, Machine FROM Times WHERE Machine IN "
									+ "(SELECT ID FROM Machines WHERE Name='" + machine + "' AND Owner='" + user
									+ "');");
						} catch (SQLException ex) {
							error(response, ex);
						}
					}

					try {
						result = processData(rs);
					} catch (SQLException ex) {
						error(response, ex);
					}
				}
			}
		}

		java.io.PrintWriter out = response.getWriter();
		response.setContentType("text/plain");
		response.setHeader("Access-Control-Allow-Origin", "*"); // To bypass warning with Firefox

		out.print(result);
		System.out.println("Result returned correctly\n");
	}

	private ResultSet queryDatabase(String query) throws SQLException {
		System.out.println("Query to database: " + query);
		Statement s = ds.getConnection().createStatement();
		ResultSet rs = s.executeQuery(query);
		System.out.println("Query successful");
		return rs;
	}

	private void error(HttpServletResponse response, SQLException ex) {
		try {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error accessing database");
		} catch (IOException e) {
			throw new RuntimeException("IOException occurred!!");
		}
		throw new RuntimeException("Error accessing database: " + ex.getMessage());
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) {
		throw new UnsupportedOperationException("POST not available");
	}

	private String processData(ResultSet s) throws SQLException {

		String result = "";
		if (!s.first())
			return "";

		s.beforeFirst();

		// Process one or more than one machine's data
		Map<Integer, Integer> map = new HashMap<>();
		int week = 0, day = 0, currentmachine = -1, machinecount = 1;
		String current;
		while (s.next()) {
			if (currentmachine == -1)
				currentmachine = s.getInt(3);
			current = s.getString(2);
			map.put(week, (map.containsKey(week)) ? map.get(week) + parseTime(current) : parseTime(current));
			day += 1;
			if (day > 6) {
				week += 1;
				day = 0;
			}
			if (s.getInt(3) != currentmachine) {
				week = 0;
				currentmachine = s.getInt(3);
				machinecount += 1;
			}
		}

		int key = 0;
		Integer value;
		while ((value = map.get(key)) != null) {
			result += key + "," + (value / 3600.0 / machinecount) + "\n";
			key++;
		}

		return result.substring(0, result.length() - 1);
	}

	private int parseTime(String str) {
		StringTokenizer tok = new StringTokenizer(str, ":");
		if (tok.countTokens() != 3) {
			throw new IllegalArgumentException();
		}

		int time = 0;
		while (tok.hasMoreTokens()) {
			time = time * 60 + Integer.parseInt(tok.nextToken());
		}
		return time;
	}
}
