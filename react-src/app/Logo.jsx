import React from 'react';

class Logo extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {
  	return(
  		<img src={chrome.extension.getURL("img/habla_logo.png")} className={this.props.className}/>
  	);
  }

}

export default Logo;

