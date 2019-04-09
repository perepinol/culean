package backend;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

public class HighLevelAdvisorServlet extends HttpServlet {
	private static final long serialVersionUID = -4809125939218699071L;

	private java.sql.Connection con;

	public void init() {
		try {
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			con = java.sql.DriverManager.getConnection("jdbc:mysql://mysql.cc.puv.fi/e1800815_CustomerLearningAnalyse",
					"e1800815", "GEIADERS");
			System.out.println("Connection done");
		} catch (SQLException e) {
			throw new RuntimeException(e.toString());
		} catch (ClassNotFoundException e) {
			throw new RuntimeException(e.toString());
		} catch (InstantiationException e) {
			throw new RuntimeException(e.toString());
		} catch (IllegalAccessException e) {
			throw new RuntimeException(e.toString());
		}

	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		java.io.PrintWriter out = response.getWriter();
		response.setContentType("text/plain");
		response.setHeader("Access-Control-Allow-Origin", "*"); // To bypass warning with Firefox
		
		String country = request.getParameter("country");
		String user = request.getParameter("user");
		String machine = request.getParameter("machine");
		String MachineId="1"; //???
		
		if (country == null || user == null || machine == null){
			throw new IllegalArgumentException("One of GET parameters is null");
		}
		
		try {
			Statement s = con.createStatement();
			System.out.println("Querying for the alarms and warnings of the machine with the ID:" + MachineId);
			ResultSet rs = s.executeQuery("SELECT AlarmNo, Text FROM Alarms1 WHERE MachineID IN " +
							"(SELECT ID FROM Machines WHERE Owner='" + user + "' AND Name='"+ machine + "')"	
							);
			
			String result = processQuery(rs);
			System.out.println("Query done and processed");
			
			System.out.println("Querying for times");
			rs = s.executeQuery("SELECT Failure, Idle, Running FROM Times WHERE Machine=(SELECT ID FROM Machines WHERE Owner='" + 
								user + "' AND Name='" + machine + "')");
			
			String [] times = processTimes(rs);
			result += times[0] + "\n" + times[1] + "\n" + times[2] + "\n";
			System.out.println("Finished processing");

			out.println(result);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		System.out.println("Tried to access the method POST");
		response.sendRedirect("customerView.html");
	}

	private String processQuery(ResultSet s) throws SQLException {
		String current;
		String [] textInfo;
		
		HashMap<String, Integer> alarms = new HashMap<String, Integer>();
		HashMap<String, String> textAlarms = new HashMap<String, String>();
		
		System.out.println("Processing query...");
		while (s.next()) {
			current = s.getString(1);
			if (current == null) continue;
			
			if (alarms.containsKey(current)) {
				alarms.put(current,  alarms.get(current) + 1);
			} else {
				alarms.put(current, 1);
				textInfo=s.getString(2).split("\\(");
				textAlarms.put(current,textInfo[0]);
			}
		}

		String result = "";
		int i = 0;
		for (Entry<String, Integer> e : sortByComparator(alarms).entrySet()) {
			result += e.getValue() + "\\" + e.getKey() + "\\" + textAlarms.get(e.getKey()) + "\n";
			i++;
			if (i >= 5) {
				break;
			}
		}
		return result;
	}

	private static Map<String, Integer> sortByComparator(Map<String, Integer> unsortMap) {

		List<Entry<String, Integer>> list = new LinkedList<Entry<String, Integer>>(unsortMap.entrySet());

		// Sorting the list based on values
		Collections.sort(list, new Comparator<Entry<String, Integer>>() {

			public int compare(Entry<String, Integer> o1, Entry<String, Integer> o2) {
				return o2.getValue().compareTo(o1.getValue());

			}
		});

		// Maintaining insertion order with the help of LinkedList
		Map<String, Integer> sortedMap = new LinkedHashMap<String, Integer>();
		for (Entry<String, Integer> entry : list) {
			sortedMap.put(entry.getKey(), entry.getValue());
		}

		return sortedMap;
	}

	public static void printMap(Map<String, Integer> map) {
		for (Entry<String, Integer> entry : map.entrySet()) {
			System.out.println("Key : " + entry.getKey() + " Value : " + entry.getValue());
		}
	}
	
	private String[] processTimes(ResultSet rs) {
		Integer[] accums = {0, 0, 0};
		try {
			while (rs.next()) {
				for (int i = 1; i <= accums.length; i++) {
					accums[i-1] += getTime(rs.getString(i));
				}
				System.out.println(accums[0] + " " + accums[1] + " " + accums[2]);
			}
			
			String[] result = new String[3];
			for (int i = 0; i < accums.length; i++) {
				String time = String.valueOf(accums[i] % 60);
				accums[i] /= 60;
				result[i] = String.valueOf(accums[i] / 60) + " hours, " + String.valueOf(accums[i] % 60) + " minutes, " + time + " seconds";
			}
			return result;
		} catch(SQLException ex) {
			throw new RuntimeException("Error processing results" + ex.getMessage());
		}
	}
	
	private Integer getTime(String str) {
		Integer result = 0;
		for (int i = 0; i < 2; i++) {
			result = result * 60 + Integer.parseInt(str.substring(0, str.indexOf(":")));
			str = str.substring(str.indexOf(":") + 1);
		}
		return result * 60 + Integer.parseInt(str);
	}
}
