import $ from "jquery";
import React from 'react';
import {SubmitInput} from './Input.jsx';
import Reply from './Reply.jsx';

var helpers = require('./Helpers.jsx');

class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.processReply = this.processReply.bind(this);
    this.displayReplyBox = this.displayReplyBox.bind(this);
    this.state = {showReply: false};
  }

  processReply(event) {
    event.preventDefault();
    let dataArray = $("#" + this.props.replyBoxId).serializeArray();
    let data = {}
    for (let i = 0; i < dataArray.length; i++) {
      let name = dataArray[i]["name"];
      let value = dataArray[i]["value"];
      data[name] = value;
    }
    data["url"] = helpers.hashes.MD5(window.location.href)
    this.setState({
      showReply: false
    })
    this.props.onReply(data);
  }

  displayReplyBox(event) {
    console.log("display reply button clicked");
    event.preventDefault();
    this.setState({
      showReply: true
    })
  }

  render() {
  	// Render children after 
    let posterName = this.props.data.posterName;
    let content = this.props.data.content;
    let id = this.props.data.id;
    let timestamp = this.props.data.timestamp;
    let children = this.props.data.children;
    let replyForm = ""
    let replyElements = [];
    for (let i = 0; i < children.length; i++) {
      replyElements.push(<Reply key={children[i].id} data={children[i]} />);
    }
    if (this.state.showReply == true) {
      replyForm = <form className="replyCommentBox" id={this.props.replyBoxId} onSubmit={this.processReply}>
          <textarea className="replyCommentTextarea" id={this.props.replyBoxId + "-textarea"} rows="4" cols="50" name="content" form={this.props.replyBoxId} placeholder="Type your comment here..."></textarea>
          <input type="hidden" name="username" value={this.props.username} />
          <input type="hidden" name="groupName" value={this.props.groupName} />
          <input type="hidden" name="parentId" value={this.props.id} />
          <SubmitInput className="postButton" name="formSubmit" />
        </form>;
    }
    return (
    	<div className="comment">
        <h2 className="hablaH2">{posterName}</h2>
        <p className="commentText">{content}</p>
        <div className="replyTimestamp">
          <button className="replyButton" onClick={this.displayReplyBox}>Reply</button>
          <p className="timestamp">{timestamp}</p>
        </div>
        <div className="replySection">
          {replyElements}
          {replyForm}
        </div>
      </div>
    );
  }

}

export default Comment;