import React from 'react';
import ReactDOM from 'react-dom';
import DropdownList from './DropdownList.js';
import ToggleButton from './ToggleButton.js';
import SliderField from './SliderField.js';
import * as logic from './graphlogic.js';

class Filters extends React.Component {
  constructor(props) {
    super(props);
    var customer = this.getCustomerData();
    this.state = { 	cust: customer,
					options: this.getData(customer.country, customer.username, "names"),
					owndata: this.getData(customer.country, customer.username, ""), 
					globaldata: this.getData("All", "", ""), 
					showOwn: true, 
					showGlobal: true, 
					showBars: true, 
					totalWeeks: 18,
					stabDuration: 3,
					stabSteep: 10
				};
    var state = this.state;
    window.plot(state.owndata, state.globaldata, state.showOwn, state.showGlobal, state.showBars, state.totalWeeks, state.stabDuration, state.stabSteep);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(target, newValue) {
  	var state = this.state;
  	if (target == "Machines") {
  		newValue = (newValue == "All") ? "" : newValue;
  		state.owndata = this.getData(this.state.cust.country, this.state.cust.username, newValue);
  	} else if (target == "Own") {
  		state.showOwn = newValue;
  	} else if (target == "Trend") {
  		state.showGlobal = newValue;
  	} else if (target == "Bars") {
  		state.showBars = newValue;
  	} else if (target == "WeekDisplay") {
  		state.totalWeeks = newValue;
  	} else if (target == "StabilityDuration") {
  		state.stabDuration = newValue;
  	} else if (target == "StabilitySteepness") {
  		state.stabSteep = newValue;
  	}
  	this.setState(state);
  	window.plot(state.owndata, state.globaldata, state.showOwn, state.showGlobal, state.showBars, state.totalWeeks, state.stabDuration, state.stabSteep);
  }
  
  getCustomerData() {
  	return {username: "Customer", country: "Spain"};
  }
  
  getData(country, user, machine) {
  	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://app3.cc.puv.fi/culean/db?country=" + country + "&user=" + user + "&machine=" + machine, false); //change for deployment
	xhr.send(null);
	var result;
	if (machine == "names") {
		result = xhr.responseText.split(";");
	} else {
		result = logic.getValues(xhr.responseText);
	}
	return result;
  }
  
  /*getData(user, machine) {
  	if (machine == "names") {
  		return "a;b".split(";");
  	} else {
  		return logic.getValues("0,0\n1,1\n2,2\n3,3\n4,4\n5,5\n6,6\n7,7\n8,8\n");
  	}
  }*/

  render() {
  	var opt = ["All"]
  	for (var i = 0; i < this.state.options.length; i++) {
  		opt.push(this.state.options[i]);
  	}
  	
	return (
		<div>
			<DropdownList name="Machines" label="Machine" options={ opt } onChange={ this.handleChange } />
			<ToggleButton name="Own" text="Show own learning" onChange={ this.handleChange } color="#E4002B"/>
			<ToggleButton name="Trend" text="Show learning trend" onChange={ this.handleChange } color="#FF7400" />
			<ToggleButton name="Bars" text="Show graph bars" onChange={ this.handleChange } color="#7A99AC" />
			<SliderField name="WeekDisplay" text="Number of weeks displayed" def={18} min={3} max={18} placeholder="Between 3 and 18" onChange={ this.handleChange } />
			<SliderField name="StabilityDuration" text="Duration" def={3} min={1} max={18} placeholder="Between 1 and 18" onChange={ this.handleChange } />
			<SliderField name="StabilitySteepness" text="Maximum daily steepness (%)" def={10} min={0.01} placeholder="Greater than 0" onChange={ this.handleChange } />
		</div>
	);
  }
}

ReactDOM.render(React.createElement(Filters), document.getElementById('root'));
