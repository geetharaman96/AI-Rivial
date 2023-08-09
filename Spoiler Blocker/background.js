chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	// First, validate the message's structure.
	if (msg.from === "popup") {
		// Enable the page-action for the requesting tab.
        console.log("recieved");
        chrome.storage.local.set({variable: msg.subject});

		sendResponse("thankyou");
	}
});

