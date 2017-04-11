console.log("working");

chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("browserAction click listener working");
	// TODO Fix style using promises fuck that
	chrome.storage.sync.get("usernames", function(data){
		var usernames = data.usernames;
		chrome.storage.sync.get("groupNames", function(data){
			var groupNames = data.groupNames;
			chrome.tabs.sendMessage(tab.id, {action: "toggleDisplay", groupNames: groupNames, usernames: usernames});
		});
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	// Store a key/value pair into storage
	console.log(request);
	if (request.action == "store") {
		// TODO put inside a try catch
		var data = request.data;
		console.log(data);
		chrome.storage.sync.set(data, function(stuff){console.log(stuff)});
		// for (key in data) {
		// 	if (data.hasOwnProperty(key)) {
		// 		var value = data[key];
		// 		chrome.storage.sync.set({
		// 			key: value
		// 		}, function(){});
		// 	}
		// }
		sendResponse({message: "success"});
	}
	// Get a key/value pair from storage
	else if (request.action == "get") {
		var key = request.key;
		sendResponse();
	}

});