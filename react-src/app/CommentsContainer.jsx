import $ from "jquery";
import React from 'react';
import CommentBox from './CommentBox.jsx';
import Comment from './Comment.jsx';

var helpers = require('./Helpers.jsx');
var config = require('./Config.jsx')


// Contains name of group.
class Header extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {

    return (
    	<p className="hablaCommentsHeader">{this.props.groupName}</p>
    );
  }
}

// Consists of a list of Comments

class CommentSection extends React.Component {

  constructor(props) {
    super(props);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.addComment = this.addComment.bind(this);
    this.state = {comments: []}
    // ajax request list of comments
    let that = this;
		let hashedUrl = helpers.hashes.MD5(window.location.href);
    console.log("Retrieving comments");
		$.ajax({
			type: "GET",
			url: config.settings.baseUrl + "api/v1/comments?url=" + hashedUrl + "&groupName=" + this.props.groupName,
			dataType: "json"
		}).done(function(data) {
			// data = {
			// 	comments: 
			// 		{
							// id1: {
								//			children: [array of comments]
								//      poster: username,
								//			timestamp: time
								// 			content: "content"
							// },
							// id2: {
								//			children: [array of comments]
								//      posterName: username,
								//			timestamp: time
								// 			content: "content"
							// }

			// 		}
			// }
			console.log("Comments retrieved: ", data);
			let results = data.comments;
			let comments = []
	    for(let i = 0; i < results.length; i++) {
	    	comments.push(results[i]);
	    }
	    that.setState({
	    	comments: comments
	    })

		}).fail(function(data) {
			// Display Error message on the UI side
		    console.log("Error: ", data);
		});
  }

  addComment(data) {
    let comment = data.comment;
    console.log(comment);
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
  }

  

  render() {

    return (
    	<div>
    		<Header groupName={this.props.groupName} />
    		<CommentSection username={this.props.username} groupName={this.props.groupName} />
      </div>
    );
  }

}

export default CommentsContainer;
