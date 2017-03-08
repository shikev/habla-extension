import React from 'react';
import LandingContainer from './LandingContainer.jsx';
import CommentsContainer from './CommentsContainer.jsx';



class MasterContainer extends React.Component {
	constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.state = this.props.initialState;
    
  }

  handleRegister(data) {
    this.setState({
      active: "Comments",
      username: data.username,
      groupName: data.groupName
    });
  }


  render() {
    let display = "";
    if (this.state.active === "Landing") {
      display = <LandingContainer onRegister={this.handleRegister}/>;
    }
    else if (this.state.active === "Comments") {
      display = <CommentsContainer username={this.state.username} groupName={this.state.groupName}/>;
    }
    return (
    	<div>
    		{display}
      </div>
    );
  }
}

export default MasterContainer;