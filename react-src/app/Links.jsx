import $ from "jquery";
import React from 'react';
import {TextInput} from './Input.jsx';
import {SubmitInput} from './Input.jsx';

var config = require('./Config.jsx');

// Comment Box has a parent that it's "replying" to. 
//If the parent is "null" then this comment box corresponds to a top level comment

class Links extends React.Component {

  constructor(props) {
    super(props);
    this.state = {links: []}
    this.processSubmit = this.processSubmit.bind(this);
    let that = this;
    $.ajax({
      type: "GET",
      url: config.settings.baseUrl + "api/v1/group/links?groupName=" + this.props.groupName,
      dataType: "json"
    }).done(function(data) {
      let links = data.links;
      if (!links) {
        links = [];
      }
      that.setState({
        links: links
      });

    }).fail(function(data) {
      // Display Error message on the UI side
        console.log("Error: ", data);
    });
  }

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.startTime !== this.state.startTime) {
      this.setState({ startTime: nextProps.startTime });
    }
    let that = this;
    $.ajax({
      type: "GET",
      url: config.settings.baseUrl + "api/v1/group/links?groupName=" + nextProps.groupName,
      dataType: "json"
    }).done(function(data) {
      let links = data.links;
      if (!links) {
        links = [];
      }
      that.setState({
        links: links
      });

    }).fail(function(data) {
      // Display Error message on the UI side
        console.log("Error: ", data);
    });
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
    console.log(data, "linkedata");
    let that = this;
  	$.ajax({
      type: "POST",
      data: data,
      url: config.settings.baseUrl + "api/v1/group/links",
      dataType: "json"
    }).done(function(data) {
      let links = that.state.links;
      links.unshift(data.link);
      that.setState({
        links: links
      })

    }).fail(function(data) {
      // Display Error message on the UI side
        console.log("Error: ", data);
    });
  }


  render() {
  	let linksToRender = [];

    if (this.state.links) {
      for (let i = 0; i < this.state.links.length; i++) {
       linksToRender.push(<a href={this.state.links[i]}>Link {i}</a>);
      }
    }
    return (
      <div>
        <form id={this.props.id} onSubmit={this.processSubmit}>
          <label className="hablaInputLabel">Add Link:</label>
          <input type="hidden" name="groupName" value={this.props.groupName} />
          <TextInput className="hablaInputBox" name="link" />
          <SubmitInput className="hablaPostButton" name="formSubmit" />
        </form>
        {linksToRender}
    
      </div>
    );
  }

}

export default Links;


