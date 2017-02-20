import React from 'react';

class Button extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {
  	return (
  		<button onClick={this.props.onClick} className={this.props.className} type="button">{this.props.text}</button>
  	);
  }
}

export default Button;
