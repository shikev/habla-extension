import $ from "jquery";
import React from 'react';
import CommentBox from './CommentBox.jsx';
import Comment from './Comment.jsx';
import Links from './Links.jsx'

var helpers = require('./Helpers.jsx');
var config = require('./Config.jsx');


// Contains name of group.
class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {links: []};
    let that = this;
    $.ajax({
      type: "GET",
      url: config.settings.baseUrl + "api/v1/group/password?groupName=" + this.props.groupName,
      dataType: "json"
    }).done(function(data) {
      let password = data.password;
      that.setState({
        password: password
      });

    }).fail(function(data) {
      // Display Error message on the UI side
        console.log("Error: ", data);
    });
  }

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.startTime !== this.state.startTime) {
      this.setState({ startTime: nextProps.startTime });
    }
    let that = this;
    $.ajax({
      type: "GET",
      url: config.settings.baseUrl + "api/v1/group/password?groupName=" + nextProps.groupName,
      dataType: "json"
    }).done(function(data) {
      let password = data.password;

      that.setState({
        password: password
      });

    }).fail(function(data) {
      // Display Error message on the UI side
        console.log("Error: ", data);
    });
  }

  render() {
    
    
    let groupNamesToRender = [];
    let addGroup = "<< Add group"
    for (let i = 0; i < this.props.groupNames.length; i++) {
      if (this.props.groupName === this.props.groupNames[i]) {
        continue;
      }
      groupNamesToRender.push(<a className="hablaLink" onClick={this.props.onGroupSwitch.bind(this, this.props.groupNames[i])}>{this.props.groupNames[i]}</a>);
    }
    return (
    	<div className="hablaHeader">
        <div className="hablaGroupHeader">
          <button id="hablaDropDownButton">
            <div className="hablaGroupName">{this.props.groupName}</div>
            <img className="hablaDropDownIcon" src={chrome.extension.getURL("img/drop_down.png")} />
          </button>
          <div id="GroupsDropDownMenu">
            {groupNamesToRender}
            <button className="hablaGroupButton" onClick={this.props.onBack}>{addGroup}</button>
          </div>
          <p className="hablaGroupPassword">{this.props.password}</p>
        </div>
        <div className="hablaLinkHeader">
          <button id="hablaLinkButton">
            <img className="hablaLinkIcon" src={chrome.extension.getURL("img/link_icon.png")} />
          </button>
          <Links id="links-form" groupName={this.props.groupName} />
        </div>
      </div>
    );
  }
}

// Consists of a list of Comments

class CommentSection extends React.Component {

  constructor(props) {
    super(props);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.addComment = this.addComment.bind(this);
    this.state = {comments: []};
    // ajax request list of comments
    let that = this;
    let hashedUrl = helpers.hashes.MD5(window.location.href);
    console.log("Retrieving comments");
    $.ajax({
      type: "GET",
      url: config.settings.baseUrl + "api/v1/comments?url=" + hashedUrl + "&groupName=" + this.props.groupName,
      dataType: "json"
    }).done(function(data) {

      console.log("Comments retrieved: ", data);
      let results = data.comments;
      let password = data.password;
      let comments = []
      for(let i = 0; i < results.length; i++) {
        comments.push(results[i]);
      }
      that.setState({
        comments: comments,
        password: password
      })
    }).fail(function(data) {
      // Display Error message on the UI side
        console.log("Error: ", data);
    });
  }

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
  if (nextProps.startTime !== this.state.startTime) {
    this.setState({ startTime: nextProps.startTime });
  }
  let that = this;
    let hashedUrl = helpers.hashes.MD5(window.location.href);
    console.log("Retrieving comments");
    $.ajax({
      type: "GET",
      url: config.settings.baseUrl + "api/v1/comments?url=" + hashedUrl + "&groupName=" + nextProps.groupName,
      dataType: "json"
    }).done(function(data) {
      // data = {
      //  comments: 
      //    {
              // id1: {
                //      children: [array of comments]
                //      poster: username,
                //      timestamp: time
                //      content: "content"
              // },
              // id2: {
                //      children: [array of comments]
                //      posterName: username,
                //      timestamp: time
                //      content: "content"
              // }

      //    }
      // }
      console.log("Comments retrieved: ", data);
      let results = data.comments;
      let password = data.password;
      let comments = []
      for(let i = 0; i < results.length; i++) {
        comments.push(results[i]);
      }
      that.setState({
        comments: comments,
        password: password
      })
    }).fail(function(data) {
      // Display Error message on the UI side
        console.log("Error: ", data);
    });
}

  addComment(data) {
    let comment = data.comment;
    let parentId = comment.parentId;
    let comments = this.state.comments;
    // If top level comment
    if(parentId == 0) {
      comments.push(comment);
    }
    else {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id == parentId) {
          comments[i].children.push(comment);
          break;
        }
      }
    }
    this.setState({
        comments: comments
    })
  }

  handleCommentSubmit(data) {
    // postData = {
    //   url: habla.utility.MD5(window.location.href),
    //   content: $commentBox.val(),
    //   groupName: "fdsa"
    // };
    var that = this;
    $.ajax({
      type: "POST",
      url: config.settings.baseUrl + "api/v1/comments",
      data: data,
      dataType: "json"
    }).done(function(comment) {
      // A comment is returned upon success

      that.addComment(comment);
    }).fail(function(data) {
      // Handle error posting comment on the UI
        alert("Error posting comment to server:", data);
    });;
  }


  render() {

  	let commentElements = [];
    for (let i = 0; i < this.state.comments.length; i++) {
     commentElements.push(<Comment replyBoxId={"reply-box-" + this.state.comments[i].id} id={this.state.comments[i].id} key={this.state.comments[i].id} data={this.state.comments[i]} username={this.props.username} groupName={this.props.groupName} onReply={this.handleCommentSubmit}/>);
    }
  	console.log(this.props.username, "Current Username");
    return (
      <div>
      	<div>
      		{commentElements}
        </div>
        <CommentBox id="habla-top-level-comment-box" username={this.props.username} groupName={this.props.groupName} onSubmit={this.handleCommentSubmit} />
      </div>
    );
  }

}





class CommentsContainer extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      groupName: this.props.groupNames[this.props.groupNames.length - 1],
      username: this.props.usernames[this.props.usernames.length - 1]
    };
    this.handleGroupSwitch = this.handleGroupSwitch.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleGroupSwitch(groupName) {
    let indexOfUsername = this.props.groupNames.indexOf(groupName);
    this.setState({
      groupName: groupName,
      username: this.props.usernames[indexOfUsername]
    });
  }

  handleBack(event) {
    this.props.onBack();
  }

  render() {
    console.log(this.state, "state in commentscontainer");
    return (
    	<div>
    		<Header groupName={this.state.groupName} groupNames={this.props.groupNames} onGroupSwitch={this.handleGroupSwitch} onBack={this.handleBack}/>
    		<CommentSection username={this.state.username} groupName={this.state.groupName} />
      </div>
    );
  }

}

export default CommentsContainer;
