import React from 'react';
import ReactDOM from 'react-dom';
import DropdownList from './DropdownList.js';
import ToggleButton from './ToggleButton.js';
import SliderField from './SliderField.js';
import UserButton from './UserButton.js';
import * as logic from './graphlogic.js';

class Filters extends React.Component {
  constructor(props) {
    super(props);
    var countries = this.getData("", "", "");
    var users = countries[Object.keys(countries)[0]]; // Get users of first country
    var first = [Object.keys(countries)[0], "All", "All"];
    
    this.state = { 	countryoptions: countries,
					useroptions: users,
					machineoptions: [],
					selected: first,
					reset: [false, false],
					data: [this.getData("All", "", "")],
					options: [{name: "Global", color: "", show: true}],
					showpoints: true,
					totalWeeks: 18,
					stabDuration: 3,
					stabSteep: 10,
					colors: [{num: "#7A99AC", taken: false}, {num: "#E4002B", taken: false}, {num: "#2D882D", taken: false}],
				};
	
    var state = this.state;
    window.plotLines(state.data, state.options, state.totalWeeks, state.stabDuration, state.stabSteep, state.showpoints);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleChange(target, newValue) {
  	var state = this.state;
  	state.reset = [false, false];
  	if (!isNaN(target)) {
  		state.options[parseInt(target)].show = newValue;
  	} else if (target == "Remove") {
  		for (var i = 1; i < state.colors.length; i++) {
  			if (state.colors[i].num == state.options[newValue].color) {
  				state.colors[i].taken = false;
  				break;
  			}
  		}
  		state.data.splice(newValue, 1);
  		state.options.splice(newValue, 1);
  	} else if (target == "Countries") {
  		state.useroptions = state.countryoptions[newValue];
  		state.selected = [newValue, "All", "All"];
  		state.reset = [true, true];
  	} else if (target == "Users") {
  		if (newValue != "All") {
	  		state.machineoptions = state.useroptions[newValue];
	  	} else {
	  		state.machineoptions = [];
	  	}
	  	state.reset = [false, true];
	  	state.selected = [state.selected[0], newValue, "All"];
  	} else if (target == "Machines") {
  		state.selected = [state.selected[0], state.selected[1], newValue];
  	} else if (target == "Trend") {
  		state.options[0].show = newValue;
  	} else if (target == "EOL") {
  		state.showpoints = newValue;
  	} else if (target == "WeekDisplay") {
  		state.totalWeeks = newValue;
  	} else if (target == "StabilityDuration") {
  		state.stabDuration = newValue;
  	} else if (target == "StabilitySteepness") {
  		state.stabSteep = newValue;
  	}
    window.plotLines(state.data, state.options, state.totalWeeks, state.stabDuration, state.stabSteep, state.showpoints);
  	this.setState(state);
  }
  
  handleClick(target) {
  	var state = this.state;
  	if (target.target.name == "Add") {
	  	var color = this.getColor();
	  	if (color == "") {
	  		return ;
	  	}
	  	
	  	var data;
	  	if (state.selected[1] == "All") {
	  		data = this.getData(state.selected[0], "", "");
	  	} else if (state.selected[2] == "All") {
	  		data = this.getData(state.selected[0], state.selected[1], ""); // Customer name and "", to get all machines average
	  	} else {
	  		data = this.getData(state.selected[0], state.selected[1], state.selected[2]); // Customer name and machine name
	  	}
	  	state.data.push(data);
	  	state.options.push({ name: state.selected[0] + ", " + state.selected[1] + ", " + state.selected[2], color: color, show: true });
	} else {
		state.data = [state.data[0]];
		state.options = [state.options[0]];
		for (var i = 0; i < state.colors.length; i++) {
			state.colors[i].taken = false;
		}
	}
    window.plotLines(state.data, state.options, state.totalWeeks, state.stabDuration, state.stabSteep, state.showpoints);
  	this.setState(state);
  }
  
  getColor() {
  	var state = this.state;
  	for (var i = 0; i < state.colors.length; i++) {
  		if (!state.colors[i].taken) {
  			state.colors[i].taken = true;
  			this.setState(state);
  			return state.colors[i].num;
  		}
  	}
  	return "";
  }
  
  getData(country, user, machine) {
  	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://app3.cc.puv.fi/culean/db?country=" + country + "&user=" + user + "&machine=" + machine, false); //change for deployment
	xhr.send(null);
	var result;
	if (country == "" && user == "" && machine == "") {
		result = logic.getNames(xhr.responseText);
	} else {
		result = logic.getValues(xhr.responseText);
	}

	return result;
  }
  
  /*getData(country, user, machine) {
  	if (country == "" && user == "" && machine == "") {
  		return logic.getNames("Spain;Customer1,a,b;Customer2,c,d\nFinland;Customer3,e,f;Customer4,g,h");
  	} else {
  		return logic.getValues(	"0,17.710555555555555\n1,15.689722222222223\n2,16.432083333333335\n3,15.82625\n4,18.56486111111111\n5,34.96055555555556\n" + 									"6,43.86472222222222\n7,54.34111111111111\n8,53.35208333333333\n9,46.12236111111111\n10,42.49861111111111\n11,44.73138888888889\n" + 									"12,33.904444444444444\n13,51.134166666666665\n14,57.52027777777778\n15,63.33416666666667\n16,64.61291666666666\n17,74.76916666666666\n" + 									"18,66.63694444444444\n19,77.2448611111111\n20,66.7688888888889\n21,62.76375\n22,45.2275\n23,28.82611111111111\n24,29.71125\n25,35.61555555555555\n26,22.105\n");
  	}
  }*/

  render() {
  	var machines = ["All"];
  	for (var i = 0; i < this.state.machineoptions.length; i++) {
  		machines.push(this.state.machineoptions[i]);
  	}
	
  	var users = ["All"];
  	for (var i = 0; i < Object.keys(this.state.useroptions).length; i++) {
  		users.push(Object.keys(this.state.useroptions)[i]);
  	}

  	var data = [];
  	for (var i = 1; i < this.state.data.length; i++) {
  		data.push(<UserButton name={ i } text={ this.state.options[i].name } onChange={ this.handleChange } color={ this.state.options[i].color } />)
  	}
  	
  	var reset = this.state.reset;
  	
	return (
		<div class="filters">
			<DropdownList name="Countries" label="Country" options={ Object.keys(this.state.countryoptions) } onChange={ this.handleChange } />
			<DropdownList name="Users" label="User" options={ users } onChange={ this.handleChange } reset={ reset[0] } />
			<DropdownList name="Machines" label="Machine" options={ machines } onChange={ this.handleChange } reset={ reset[1] } />
			<button class="filterbutton" name="Add" onClick={ this.handleClick }>Add</button>
			<button class="filterbutton" name="Reset" onClick={ this.handleClick }>Reset</button>
			<ToggleButton name="Trend" text="Show learning trend" onChange={ this.handleChange } color="#FF7400" />
			<ToggleButton name="EOL" text="Show end-of-learning points" onChange={ this.handleChange } />
			<SliderField name="WeekDisplay" text="Number of weeks displayed" def={18} min={3} max={18} onChange={ this.handleChange } />
			<SliderField name="StabilityDuration" text="Duration (days)" def={3} min={1} max={18} placeholder="Between 1 and 18" onChange={ this.handleChange } />
			<SliderField name="StabilitySteepness" text="Maximum daily steepness (%)" def={10} min={0} placeholder="Greater than 0" onChange={ this.handleChange } />
			<div>
				{data}
			</div>
		</div>
	);
  }
}

ReactDOM.render(React.createElement(Filters), document.getElementById('root'));
