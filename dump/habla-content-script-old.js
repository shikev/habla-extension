
console.log("Content Script Loaded");

function Container(id, classes) {
	// Internal Data
	this.id = id;
	this.classes = classes;
	this.$html = $("<div>", {id: this.id + "-container"}).addClass(classes);
	this.addElement = function($element) {
		this.$html.append($element);
	}
}

function Button(id, classes, text) {
	this.id = id;
	this.classes = classes;
	this.$html = $("<button>", {id: this.id + "-button"}).addClass(classes).text(text);
}

function Form(id, classes) {
	this.id = id;
	this.classes = classes;
	this.$html = $("<form>", {id: this.id + "-form"}).addClass(classes);
	// attributes is an object where key is attribute and value is value
	this.addInput = function(attributes, label=null) {

		var $input = $('<input>');
		for (attribute in attributes) {
			if (attributes.hasOwnProperty(attribute)) {
				$input.attr({attribute: attributes[attribute]});
			}
		}
		if (label) {
			var $label = $("<label>").text(label);
			$input.appendTo($label);
			this.$html.append($label);
		}
		else {
			this.$html.append($input);
		}
	}
}

function Comment(content, id) {
	// Internal Data
	this.content = content;
	this.id = id;
	// HTML and Event Handlers
	this.$html = $("<div>", {id: "comment-" + this.id, "class": "habla-comment"}).text(content);

	// Member functions
};

function CommentList() {
	// Internal Data
	this.comments = [];
	this.maxId = 0;

	this.$html = $("<div>", {id: "comments-list"});

	// Displays all comments currently in this.comments 
	this.display = function() {
		$( ".comment" ).remove();
		// var idCounter = 0;
		for (var i = 0; i < this.comments.length; i++) {
			// append comment in divs within #comment-list
			this.$html.append(this.comments[i].$html);
		}
	};

	// Fetches a list of new comments from the server
	this.refresh = function() {
		var that = this;
		hashedUrl = habla.utility.MD5(window.location.href);
		console.log("Retrieving comments");
		$.ajax({
			type: "GET",
			url: habla.baseUrl + "api/v1/comments?url=" + hashedUrl + "&groupName=fdsa",
			dataType: "json"
		}).done(function(data) {
			// data = {
			// 	comments: [
			// 		{
			// 			content: "content",
			// 			id: "id"
			// 		}
			// 	]
			// }
			console.log("Data retrieved: ", data);
			results = data.comments;
		    for(var i = 0; i < results.length; i++) {
		    	that.comments.push(new Comment(results[i].content, results[i].id));
		    }
		    that.display();
		}).fail(function(data) {
			// Display Error message on the UI side
		    console.log("Error: ", data);
		});
	};

	// Adds a comment locally, then display it at the top 
	this.addComment = function(comment) {
		console.log("Comment added: ", comment);
		this.comments.push(comment);
	};
	

	
};

function CommentBox(commentList) {
	// Internal variables
	this.commentList = commentList;
	console.log(this);
	// HTML AND EVENT HANDLERS
	var $container = $("<div>", {id: "comment-box-container"});
	var $commentBox = $("<textarea>", {id: "comment-box", placeholder: "Type your comment here!"});
	var $buttonContainer = $("<div>", {id: "comment-box-submit"});
	var $button = $("<a>", {id: "comment-box-submit-button"}).text("Submit");
	var that = this;
	$button.click(function() {
		postData = {
			url: habla.utility.MD5(window.location.href),
			content: $commentBox.val(),
			groupName: "fdsa"
		};
	  	$.ajax({
			type: "POST",
			url: habla.baseUrl + "api/v1/comments",
			data: jQuery.param(postData),
			dataType: "json"
		}).done(function(data) {
			// data = {
			// 	comment: {
			// 		content: "content",
			// 		id: "id"
			// 	}
			// }
			results = data.comment;
			that.commentList.addComment(new Comment(results.content, results.id));
			that.commentList.display();
		}).fail(function(data) {
			// Handle error posting comment on the UI
		    alert("Error posting comment to server:", data);
		});;
	});

	this.$html = $container.
		append($commentBox).
		append($buttonContainer.
			append($button));
}

function Landing() {
	this.container = new Container("signup", "signup");

	// Contains two buttons: one for join, one for create 
	this.firstLanding = new Container("first-landing", "first-landing");

	var createGroupButton = new Button("create-group", "signupButton", "Create Group");
	var joinGroupButton = new Button("join-group", "signupButton", "Join Group");
	this.firstLanding.addElement(createGroupButton.$html);
	this.firstLanding.addElement(joinGroupButton.$html);


	this.createGroupButton.$html.click(function() {
		// remove first landing from container, then append create group form.
		this.firstLanding.$html.remove();
		this.container.addElement(this.createGroupForm.$html);
		// Display back button
	});
	joinGroupButton.$html.click(function() {
		// remove first landing from container, then append join group form.
		this.firstLanding.$html.remove();
		this.container.addElement(this.joinGroupForm.$html);
		// Display back button
	});


	this.createGroupForm = new Form("create-group", "create-group-form");
	this.joinGroupForm = new Form("join-group", "join-group-form");

	this.createGroupForm.addInput({
		type: "text",
		name: "username",
		placeholder: "John Doe",
	}, "Username:");

	this.createGroupForm.addInput({
		type: "text",
		name: "groupName",
		placeholder: "My Group",
	}, "Group Name:");

	this.createGroupForm.addInput({
		type: "password",
		name: "groupPassword",
	}, "Group Password:");

	this.createGroupForm.addInput({
		id: "create-group-submit",
		type: "submit",
	});

	this.joinGroupForm.addInput({
		type: "text",
		name: "groupName",
		placeholder: "Someone's Group",
	}, "Group Name:");

	this.joinGroupForm.addInput({
		type: "password",
		name: "groupPassword",
	}, "Group Password:");

	this.joinGroupForm.addInput({
		type: "text",
		name: "username",
		placeholder: "John Doe",
	}, "Join as:");

	this.joinGroupForm.addInput({
		id: "join-group-submit",
		type: "submit",
	});

	this.container.addElement(this.firstLanding.$html);
	this.$html = container.$html;
	
}

// When browser action is clicked


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // request contains the YOURMESSAGEPAYLOAD sent above as a Javascript object literal
    console.log("Request received from background page: ", request);
    if (request.action == "initialize") {
    	habla.container = new Container("habla-master", "habla-master-container");
	    $("body").append(habla.container.$html);
    	// User already has a username and is part of a group
    	if (request.groupName && request.username) {
	    	habla.commentList = new CommentList()
			habla.commentBox = new CommentBox(habla.commentList);
			habla.container.$html.append(habla.commentList.$html);
			habla.container.$html.append(habla.commentBox.$html);
			habla.commentList.refresh();
    	}
    	// If the user doesn't have a username or group, display join/create group GUI
    	else {
    		landing = new Landing();
    		habla.signupContainer = new Container("signup", "signup");
    		habla.signupContainer.addElement(new Button("create-group", "signupButton", "Create Group"));
    		habla.signupContainer.addElement(new Button("join-group", "signupButton", "Join Group"));
    	}

   }
});


