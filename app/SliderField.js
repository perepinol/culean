import React from 'react';
import Slider from 'rc-slider';
import '!style-loader!css-loader!rc-slider/assets/index.css'; 


export default class SliderField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.def
		};
    	this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(val) {
		this.setState({value: val});
		this.props.onChange(this.props.name, val);
	}
	
	render() {
		return (
			<div class="filter">
				<label for={this.props.name}>{this.props.text}: { this.state.value }</label>
				<Slider name={this.props.name} min={this.props.min} max={this.props.max} defaultValue={this.props.def} onChange={ this.handleChange } />
			</div>
		);
	}
} 
