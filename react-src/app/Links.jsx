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
      console.log(links, "links retrieved");
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
  	let postData = {}
  	for (let i = 0; i < dataArray.length; i++) {
  		let name = dataArray[i]["name"];
  		let value = dataArray[i]["value"];
  		postData[name] = value;
  	}
    let that = this;
  	$.ajax({
      type: "POST",
      data: postData,
      url: config.settings.baseUrl + "api/v1/group/links",
      dataType: "json"
    }).done(function(data) { 
      let links = that.state.links;
      links.unshift(postData.link);
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
       linksToRender.push(<a className="hablaLink" href={this.state.links[i]}>{this.state.links[i]}</a>);
      }
    }
    return (
      <div id="LinksDropDownMenu">
        {linksToRender}
        <form className="hablaAddLinkForm" id={this.props.id} onSubmit={this.processSubmit}>
          <label className="hablaAddLinkLabel">Add Link:</label>
          <input type="hidden" id="groupName" name="groupName" value={this.props.groupName} />
          <TextInput className="hablaAddLinkInputBox" name="link" />
          <SubmitInput text="+" className="hablaAddLinkPostButton" name="formSubmit" />
        </form>
    
      </div>
    );
  }

}

export default Links;


