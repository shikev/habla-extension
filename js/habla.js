function Comment(content, id) {
	this.content = content;
	this.id = id;
	this.generateElement = function() {
		var $comment = $("<div>", {id: "comment-" + this.id, "class": "habla-comment"});
		$comment.mouseover(function() {
			console.log("Comment with id " + this.id + " was moused over!");
		});
		return $comment;
	}
};

function CommentList() {
	this.comments = [];

	this.display = function() {
		$( ".comment" ).remove();
		var idCounter = 0;
		for (var i = 0; i < this.comments.length; i++) {
			// append comment in divs within #comment-list
			idCounter += 1;
			var $div = $("<div>", {id: "comment" + idCounter, "class": "habla0comment"});
			$div.html(this.comments[i].content);
			$("#comments-list").append($div);
		}
	};
	this.addComment = function(comment) {
		this.comments.unshift(comment);
	};

	// get current tab url
	var that = this;
	$.when(chrome.tabs.getSelected(null, function(tab) {
	    var tabUrl = tab.url;
	    habla.currentUrl = tabUrl;
	})).then(function() {
		// Fetch comments for this url from the server. EncodeURIComponent for safe transport
		$.ajax({
			type: "GET",
			url: habla.baseUrl + "api/v1/comments?url=" + habla.currentUrl,
			dataType: "json"
		}).done(function(data) {
			console.log(data);
			results = data.comments;
		    for(var i = 0; i < results.length; i++) {
		    	that.comments.push(new Comment(results[i], i));
		    }
		    that.display();
		}).fail(function(data) {
		    alert( "error" );
		});
	});
	

	
};

function CommentBox() {
	
	$("#comment-box-submit-button").click(function() {
		postData = {
			url: habla.currentUrl,
			content: $("#comment-box").val()
		};
	  	$.ajax({
			type: "POST",
			url: habla.baseUrl + "api/v1/comments",
			data: jQuery.param(postData),
			dataType: "json",
			context: this
		}).done(function() {
			habla.commentList.addComment(new Comment(postData.content, habla.commentList.comments.length));
			habla.commentList.display();
		}).fail(function(data) {
		    alert( "error" );
		});;
	});
}

// When browser action is clicked
document.addEventListener('DOMContentLoaded', function() {
		habla.commentList = new CommentList();
		habla.commentBox = new CommentBox();
});
