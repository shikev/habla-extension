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
    	<div>
    		<h2>{this.props.groupName}</h2>
      </div>
    );
  }
}

// Consists of a list of Comments

class CommentSection extends React.Component {

  constructor(props) {
    super(props);
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
								//      poster: username,
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
  render() {
  	let commentElements = [];
  	for (let i = 0; i < this.state.comments.length; i++) {
  		commentElements.push(<Comment data={this.state.comments[i]} />);
  	}
    return (
      <div>
      	<div>
      		{commentElements}
        </div>
        <CommentBox />
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
        fuck
    		<Header groupName={this.props.groupName} />
    		<CommentSection username={this.props.username} groupName={this.props.groupName} />
      </div>
    );
  }

}

export default CommentsContainer;
