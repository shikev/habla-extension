console.log("working");

chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("browserAction click listener working");
	username = chrome.storage.sync.get("username", function(data){});
	groupName = chrome.storage.sync.get("groupName", function(data){});
	chrome.tabs.sendMessage(tab.id, {action: "initialize", groupName: groupName, username: username});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	// Store a key/value pair into storage
	if (request.action == store) {
		var key = request.key;
		var value = request.value;
	}
	// Get a key/value pair from storage
	else if (request.action == get) {
		var key = request.key;
		sendResponse();
	}

});