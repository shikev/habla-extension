import $ from "jquery";
import React from 'react';
import {render} from 'react-dom';
import MasterContainer from './MasterContainer.jsx';

window.hablaHasDisplayed = false;

$(document).ready(function(){
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	  if (request.action == "toggleDisplay") {
	  	if (window.hablaHasDisplayed) {
	  		$("#habla").toggle();
	  	}
	  	
	  	else {
	  		// Habla has never been shown
	  		window.hablaHasDisplayed = true;
	  		var state = {}	
		    if (request.groupNames && request.usernames) {
		      
		      state = {
		        active: "Comments",
		        usernames: request.usernames,
		        groupNames: request.groupNames
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

	  	
	  }
	});
});





