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
    let hablaAdminIcon = ""

    if (this.props.data.privilege == "admin") {
      hablaAdminIcon = <img src={chrome.extension.getURL("img/admin_icon.png")} className="hablaAdminIcon" />
    }

    return (
      <div className="hablaReply">
        <span>
          {hablaAdminIcon}
          <h2 className="hablaH2">{posterName}</h2>
        </span>
        <p className="hablaCommentText">{content}</p>
        <div className="hablaReplyTimestamp">
          <p className="hablaTimestamp">{timestamp}</p>
        </div>
      </div>
    );
  }

}

export default Reply;