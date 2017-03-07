import React from 'react';


class Logo extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {
  	return(
  		<img src="../img/habla_icon.jpg" className={this.props.className}/>
  	);
  }

}

export default Logo;

