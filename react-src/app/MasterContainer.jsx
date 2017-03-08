import React from 'react';
import LandingContainer from './LandingContainer.jsx';
import CommentsContainer from './CommentsContainer.jsx';



class MasterContainer extends React.Component {
	constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    var that = this;
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action == "initialize") {
        if (request.groupName && request.username) {
          console.log("button-clicked");
          that.setState({
            active: "Comments",
            username: request.username,
            groupName: request.groupName
          });
        }
        // If the user doesn't have a username or group, display join/create group GUI
        else {
          that.setState({
            active: "Landing"
          });
        }
      }
    });
    this.state = {active: "None"};
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