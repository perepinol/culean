import React from 'react';

export default class DropdownList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.options[0] };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(event) {
  	this.setState({value: event.target.value});
  	this.props.onChange(this.props.name, event.target.value);
  }

  render() {
  	var rows = [];
    for (var i = 0; i < this.props.options.length; i++) {
    	rows.push(<option value={ this.props.options[i] }>{ this.props.options[i] }</option>);
    }
    
    return (
    	<div class="filter">
    		<p>{this.props.label}: </p>
			<select onChange={this.handleChange} value={ this.props.reset ? this.props.options[0] : this.state.value } >
				{rows}
			</select>
		</div>
    );
  }
}
