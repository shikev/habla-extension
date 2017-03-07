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
    return (
    	<div>
    		{this.props.data.poster}
    		{this.props.data.content}
    		<CommentFooter />

      	</div>
    );
  }

}

export default Comment;