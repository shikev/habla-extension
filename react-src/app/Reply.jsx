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
    let adminIcon = ""

    if (this.props.data.privilege == "admin") {
      adminIcon = <img src={chrome.extension.getURL("img/admin_icon.png")} className="adminIcon" />
    }

    return (
      <div className="reply">
        <span>
          {adminIcon}
          <h2 className="hablaH2">{posterName}</h2>
        </span>
        <p className="commentText">{content}</p>
        <div className="replyTimestamp">
          <p className="timestamp">{timestamp}</p>
        </div>
      </div>
    );
  }

}

export default Reply;