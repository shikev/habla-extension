console.log("working");

chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("browserAction click listener working");
	chrome.tabs.sendMessage(tab.id, {action: "initialize"});
});
