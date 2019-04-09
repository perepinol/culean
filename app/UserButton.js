import React from 'react';


export default class ToggleButton extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.defaultValue == null) {
			this.state = { defaultValue: true };
		} else {
			this.state = { defaultValue: this.props.defaultValue };
		}
    	this.handleChange = this.handleChange.bind(this);
    	this.handleButton = this.handleButton.bind(this);
	}
	
	handleChange(event) {
		this.props.onChange(this.props.name, event.target.checked);
	}
	
	handleButton(event) {
		this.props.onChange("Remove", event.target.name);
	}
	
	render() {
		return (
			<div class="filter">
				<input type="checkbox" id={this.props.name} name={this.props.name} defaultChecked={this.state.defaultValue} onClick={this.handleChange} />
				<label for={this.props.name} style={{color: this.props.color}} >&nbsp;{this.props.text}</label>
				<button style={{ margin: "0 0 0 1em" }} name={this.props.name} onClick={this.handleButton}> Remove </button>
			</div>
		);
	}
} 
