import $ from "jquery";
import React from 'react';
import {SubmitInput} from './Input.jsx';
import {TextInput} from './Input.jsx';

var helpers = require('./Helpers.jsx');

// Comment Box has a parent that it's "replying" to. 
//If the parent is "null" then this comment box corresponds to a top level comment

class CommentBox extends React.Component {

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
  	data["url"] = helpers.hashes.MD5(window.location.href)

  	this.props.onSubmit(data);
  	$("#" + this.props.id + "-textarea").val("");
  }


  render() {
  	// TODO: MODULARIZE THE INPUTS HERE
    return (
      <div>
        <form id={this.props.id} onSubmit={this.processSubmit}>
          <TextInput className="hablaInputBox" name="link" />
          <SubmitInput className="hablaPostButton" name="formSubmit" />
        </form>
      </div>
    );
  }

}

export default CommentBox;