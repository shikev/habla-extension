import React from 'react';
import LandingContainer from './LandingContainer.jsx';
import CommentsContainer from './CommentsContainer.jsx';



class MasterContainer extends React.Component {
	constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    let initialState = this.props.initialState;
    this.state = initialState;
    
  }

  handleRegister(data) {
    if(!this.state.groupNames) {
      this.state.groupNames = []
    }
    if(!this.state.usernames) {
      this.state.usernames = []
    }
    let newGroupNames = this.state.groupNames;
    newGroupNames.push(data.groupName);
    data.groupNames = newGroupNames;
    let newUsernames = this.state.usernames;
    newUsernames.push(data.username);
    data.usernames = newUsernames;
    let that = this;
    chrome.runtime.sendMessage({action: "store", data: data}, function(response) {
        if (response.message == "success") {
          // Switch view to CommentsContainer
          that.setState({
            active: "Comments",
            usernames: data.usernames,
            groupNames: data.groupNames
          });
        }
        else {
          alert("Error storing elements in storage, check your data/env", response);
        }
    });
    
  }

  handleBack(event) {
    this.setState({
      active: "Landing",
    });
  }

  handleContinue(event) {
    this.setState({
      active: "Comments"
    })
  }

  render() {
    let display = "";
    if (this.state.active === "Landing" && this.state.groupNames) {
      display = <LandingContainer onRegister={this.handleRegister} onContinue={this.handleContinue}/>;
    }
    else if(this.state.active === "Landing") {
      display = <LandingContainer onRegister={this.handleRegister}/>;
    }
    else if (this.state.active === "Comments") {
      display = <CommentsContainer onBack={this.handleBack} usernames={this.state.usernames} groupNames={this.state.groupNames}/>;
    }
    return (
    	<div>
    		{display}

      </div>
    );
  }
}

export default MasterContainer;