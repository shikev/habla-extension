import React from 'react';
import LandingContainer from './LandingContainer.jsx';
import CommentsContainer from './CommentsContainer.jsx';



class MasterContainer extends React.Component {
	constructor(props) {
    super(props);
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


  render() {
    let display = "";
    if (this.state.active === "Landing") {
      display = <LandingContainer />;
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