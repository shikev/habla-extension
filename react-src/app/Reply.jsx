import React from 'react';
import {SubmitInput} from './Input.jsx';

var helpers = require('./Helpers.jsx');

class Reply extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
  	// Render children after 
    let posterName = this.props.data.posterName;
    let content = this.props.data.content;
    let id = this.props.data.id;
    let timestamp = this.props.data.timestamp;

    return (
    	 <div id={id}>
    		{posterName}
        {timestamp}
        {content}

      	</div>
    );
  }

}

export default Reply;