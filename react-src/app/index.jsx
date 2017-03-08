import $ from "jquery";
import React from 'react';
import {render} from 'react-dom';
import MasterContainer from './MasterContainer.jsx';


$(document).ready(function(){
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	  if (request.action == "initialize") {
	  	var state = {}		
	    if (request.groupName && request.username) {
	      console.log("button-clicked");
	      state = {
	        active: "Comments",
	        username: request.username,
	        groupName: request.groupName
	      };
	    }
	    // If the user doesn't have a username or group, display join/create group GUI
	    else {
	     state = {
	        active: "Landing"
	      };
	    }

	    $("body").append($("<div>", {id: "habla"}));
		render(<MasterContainer initialState={state}/>, document.getElementById("habla"));
	  }
	});
});





