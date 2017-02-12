// var j = document.createElement('jquery');
// j.src = chrome.extension.getURL('jquery-3.1.1.min.js');
// (document.head||document.documentElement).appendChild(j);
// console.log("trying to load jquery");
// j.onload = function() {
	// console.log(document);
	// var s = document.createElement('script');
	// s.src = chrome.extension.getURL('script.js');
	// (document.head||document.documentElement).appendChild(s);

	// s.onload = function() {
	//     s.parentNode.removeChild(s);
	// };

//     j.parentNode.removeChild(s);
// };
console.log("Content Script Loaded");

function Container(id, classes) {
	// Internal Data
	this.id = id;
	this.classes = classes;
	this.$html = $("<div>", {id: this.id + "-container"}).addClass(classes);
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
		$.ajax({
			type: "GET",
			url: habla.baseUrl + "api/v1/comments?url=" + hashedUrl,
			dataType: "json"
		}).done(function(data) {
			console.log("Data retrieved: ", data);
			results = data.comments;
		    for(var i = 0; i < results.length; i++) {
		    	that.comments.push(new Comment(results[i].content, results[i].id));
		    }
		}).fail(function(data) {
			// Display Error message on the UI side
		    console.log("Error: ", data);
		});
	};

	// Adds a comment locally, then display it at the top 
	this.addAndDisplayComment = function(comment) {
		console.log("Comment added: ", comment);
		this.comments.unshift(comment);
	};
	

	
};

function CommentBox(commentList) {
	// Internal variables
	this.commentList = commentList;
	// HTML AND EVENT HANDLERS
	var $container = $("<div>", {id: "comment-box-container"});
	var $commentBox = $("<textarea>", {id: "comment-box-container"});
	var $buttonContainer = $("<div>", {id: "comment-box-submit"});
	var $button = $("<a>", {id: "comment-box-submit-button"});
	$button.click(function() {
		postData = {
			url: habla.utility.MD5(window.location.href),
			content: $commentBox.val()
		};
	  	$.ajax({
			type: "POST",
			url: habla.baseUrl + "api/v1/comments",
			data: jQuery.param(postData),
			dataType: "json",
			context: this
		}).done(function(data) {
			results = data;
			this.commentList.addComment(new Comment(results.content, results.id));
			this.commentList.display();
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

// When browser action is clicked


chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    // request contains the YOURMESSAGEPAYLOAD sent above as a Javascript object literal
    console.log("Request received from background page: ", request);
    if (request.action == "initialize") {
    	console.log(habla);
    	habla.container = new Container("habla-master", "habla-master-container");
    	$("body").append(habla.container.$html);
    	console.log(habla);
    	habla.commentList = new CommentList()
		habla.commentBox = new CommentBox(habla.commentList);
		console.log(habla);
		habla.container.$html.append(habla.commentList.$html);
		habla.container.$html.append(habla.commentBox.$html);


  //  	 	var $div = $("<div>", {id: "foo", "class": "habla-container"});
		// $("body").append($div);

		// var $div = $("<div>", {id: "poo", "class": "habla-content"});
		// $div.text('fuck with me you know I got it');
		// $("#foo").append($div);

		// var $other = $div;
		// $other.text('changed!');



		// console.log("I did it!");
   }
});

