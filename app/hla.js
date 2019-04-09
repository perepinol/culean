import React from 'react';
import ReactDOM from 'react-dom';
import DropdownList from './DropdownList.js';
import ToggleButton from './ToggleButton.js';
import SliderField from './SliderField.js';
import UserButton from './UserButton.js';
import * as logic from './graphlogic.js';

class HLAParams extends React.Component {
  constructor(props) {
    super(props);
    var countries = this.getData("", "", "");
    var users = countries[Object.keys(countries)[0]]; // Get users of first country
    var machines = users[Object.keys(users)[0]]; // Get machines of first user
    var sel = [Object.keys(countries)[0], Object.keys(users)[0], machines[0]];
    this.state = { 	initial: sel,
    				countryoptions: countries,
					useroptions: users,
					machineoptions: machines,
					selected: sel,
					reset: [false, false],
					header: "<tr><th><p> Instances </p></th><th><p> Alarm code </p></th><th><p> Alarm info </p></th><tr>"
				};
	
    var state = this.state;
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleChange(target, newValue) {
  	var state = this.state;
  	state.reset = [false, false]
  	if (target == "Countries") {
  		state.useroptions = state.countryoptions[newValue];
  		state.machineoptions = state.useroptions[Object.keys(state.useroptions)[0]];
  		state.selected = [newValue, Object.keys(state.useroptions)[0], state.machineoptions[0]];
  		state.reset = [true, true]
  	} else if (target == "Users") {
	  	state.machineoptions = state.useroptions[newValue];
	  	state.selected = [state.selected[0], newValue, state.machineoptions[0]];
	  	state.reset = [false, true]
  	} else if (target == "Machines") {
  		state.selected = [state.selected[0], state.selected[1], newValue];
  	}
  	this.setState(state);
  }
  
  handleClick(target) {
  	var state = this.state;
  	var doc = document.getElementById("alarms");
  	doc.innerHTML = this.getData(state.selected[0], state.selected[1], state.selected[2]);
  	state.selected = state.initial;
  	this.setState(state);
  }
  
  getData(country, user, machine) {
  	var xhr = new XMLHttpRequest();
	if (country == "" && user == "" && machine == "") {
		xhr.open("GET", "http://app3.cc.puv.fi/culean/db?country=" + country + "&user=" + user + "&machine=" + machine, false); //change for deployment
		xhr.send(null);
		return logic.getNames(xhr.responseText);
	} else {
		xhr.open("GET", "http://app3.cc.puv.fi/culean/highleveladvisor?country=" + country + "&user=" + user + "&machine=" + machine, false); //change for deployment
		xhr.send(null);
		var alarms = xhr.responseText.split("\n");
		var table = this.state.header;
		var i = 0;
		for (; i < 5 && i < alarms.length; i++) {
			table += "<tr><td>" + alarms[i].split("\\")[0] + "</td><td>" + alarms[i].split("\\")[1] + "</td><td>" + alarms[i].split("\\")[2] + "</td></tr>";
		}
		table += "<tr><td style=\"color:red\"> Failure time: </td><td></td><td> " + alarms[i] + " </td></tr>"
		table += "<tr><td> Idle time: </td><td></td><td> " + alarms[i+1] + " </td></tr>"
		table += "<tr><td style=\"color:green\"> Running time: </td><td></td><td> " + alarms[i+2] + " </td></tr>"
		return table;
	}
  }
  
  /*getData(country, user, machine) {
  	if (country == "" && user == "" && machine == "") {
  		return logic.getNames("Spain;Customer1,a,b;Customer2,c,d\nFinland;Customer3,e,f;Customer4,g,h");
  	} else {
  		var alarms = "100:900\n200:800\n300:700\n400:600\n500:500\n".split("\n");
  		var table = this.state.header;
		for (var i = 0; i < 5 && i < alarms.length; i++) {
			table += "<tr><td>" + alarms[i].split(":")[0] + "</td><td>" + alarms[i].split(":")[1] + "</td><td>" + "TEXT" + "</td></tr>";
		}
		return table;
  	}
  }*/

  render() {  	
	return (
		<div class="filters">
			<DropdownList name="Countries" label="Country" options={ Object.keys(this.state.countryoptions) } onChange={ this.handleChange } />
			<DropdownList name="Users" label="User" options={ Object.keys(this.state.useroptions) } onChange={ this.handleChange } reset={ this.state.reset[0] } />
			<DropdownList name="Machines" label="Machine" options={ this.state.machineoptions } onChange={ this.handleChange } reset={ this.state.reset[1] } />
			<button class="filterbutton" name="Analyze" onClick={ this.handleClick }>Analyze</button>
		</div>
	);
  }
}

ReactDOM.render(React.createElement(HLAParams), document.getElementById('root'));
