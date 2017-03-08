import React from 'react';

class CommentFooter extends React.Component {

  constructor(props) {
    super(props);

  }
  render() {

    return (
    	<div>

      </div>
    );
  }

}

// Consists of Username, Content, CommentFooter, Chidren Comments	

class Comment extends React.Component {

  constructor(props) {
    super(props);

  }
  render() {
  	// Render children after 
    let posterName = this.props.data.posterName;
    let content = this.props.data.content;
    let id = this.props.data.id;
    let timestamp = this.props.data.timestamp;
    let children = this.props.data.children;
    return (
    	<div>
    		{posterName}
        {timestamp}
        {content}
    		<CommentFooter />

      	</div>
    );
  }

}

export default Comment;