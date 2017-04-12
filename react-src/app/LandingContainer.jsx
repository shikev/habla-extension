import $ from "jquery";
import React from 'react';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import {TextInput} from './Input.jsx';
import {PasswordInput} from './Input.jsx';
import {SubmitInput} from './Input.jsx';

var config = require('./Config.jsx')

class InitialLandingMenu extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {

  	let hablaLogoClasses = "hablaLogo";
  	let hablaLandingButtonClasses = "hablaLandingButton";
    let continueButton;
    let continueButtonText = "Continue >>"
    if (this.props.onContinue) {
      continueButton = <Button className="hablaContinueButton" text={continueButtonText} onClick={this.props.onContinue}/>
    }
  	return (
	  	<div>
		  	<Logo className={hablaLogoClasses}/>
				<Button className={hablaLandingButtonClasses} text="Join Group" onClick={this.props.onJoinSelect}/>
				<Button className={hablaLandingButtonClasses} text="Create Group" onClick={this.props.onCreateSelect}/>
        {continueButton}
			</div>
		);
  }
}

class LandingForm extends React.Component {
	constructor(props) {
    super(props);
    this.processSubmit = this.processSubmit.bind(this);
  }

  processSubmit(event) {
  	event.preventDefault();
  	let dataArray = $("#" + this.props.id).serializeArray();
  	let data = {}
  	for (let i = 0; i < dataArray.length; i++) {
  		let name = dataArray[i]["name"];
  		let value = dataArray[i]["value"];
  		data[name] = value;
  	}
  	this.props.onSubmit(data);
  }

  render() {
    let hablaLogoClasses = "hablaLogo";
    let back = "<< Back"
    return (
    	<div>
        <Logo className={hablaLogoClasses}/>
    		<h1 className="hablaH1">{this.props.title}</h1>
        <form id={this.props.id} onSubmit={this.processSubmit}>
          <label className="hablaInputLabel">Group name:</label>
          <TextInput className="hablaInputBox" name="groupName" />
          <label className="hablaInputLabel">Group password:</label>
          <PasswordInput className="hablaInputBox" name="groupPassword" />
          <label className="hablaInputLabel">Your username:</label>
          <TextInput className="hablaInputBox" name="username" />
          <SubmitInput className="hablaGeneralButton" name="formSubmit" />
        </form>
    		<button className="hablaBackButton" onClick={this.props.onBack}>{back}</button>
      </div>
    );
  }
}



class LandingContainer extends React.Component {

  constructor(props) {
    super(props);
    // activeUI is showInitial, showJoinForm, or showCreateForm
    this.state = {active : "showInitial"};

    this.handleJoinSelect = this.handleJoinSelect.bind(this);
    this.handleCreateSelect = this.handleCreateSelect.bind(this);
    this.handleBackSelect = this.handleBackSelect.bind(this);
    this.handleJoinFormSubmit = this.handleJoinFormSubmit.bind(this);
    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.register = this.register.bind(this);
  }

  // registerPath is join or create
  register(data, registerPath) {
    var that = this;
  	console.log(data);
  	$.ajax({
			type: "POST",
			url: config.settings.baseUrl + registerPath,
			data: data,
			dataType: "json"
		}).done(function(d) {
      that.props.onRegister(data);
		}).fail(function(data) {
				let errors = data["errors"];
				// TODO: handle error
				// (Pass errors to the child Landing Form)
		    alert("Error Registering on server:", data);
		});
  }

  handleJoinFormSubmit(data) {
  	this.register(data, "api/v1/group/join");
  	
  	// Once username and group are set, go to normal UI
  }

  handleCreateFormSubmit(data) {
  	this.register(data, "api/v1/group/create");

  }

  handleJoinSelect(event) {
  	this.setState({
      active: "showJoinForm"
    });
  }

  handleCreateSelect(event) {
  	this.setState({
      active: "showCreateForm"
    });
  }

  handleBackSelect(event) {
  	this.setState({
      active: "showInitial"
    });
  }

  render() {

  	let joinForm = this.state.active === "showJoinForm" ? <LandingForm id="habla-join-group-form" title="Join Group" onBack={this.handleBackSelect} onSubmit={this.handleJoinFormSubmit} /> : "";
  	let createForm = this.state.active === "showCreateForm" ? <LandingForm id="habla-create-group-form" title="Create Group" onBack={this.handleBackSelect} onSubmit={this.handleCreateFormSubmit} /> : "";
  	let initial = this.state.active === "showInitial" ? <InitialLandingMenu onContinue={this.props.onContinue} onCreateSelect={this.handleCreateSelect} onJoinSelect={this.handleJoinSelect}/> : "";

    return (
    	<div>
	      {joinForm}
	      {createForm}
	      {initial}
      </div>
    );
  }

}

export default LandingContainer;
