function addKeyword() {
  const keyword = document.getElementById("keyword").value.trim();
  if (keyword !== "") {
    chrome.storage.local.get({ blockedKeywords: [] }, function(result) {
      const blockedKeywords = result.blockedKeywords;
      blockedKeywords.push(keyword);
      chrome.storage.local.set({ blockedKeywords: blockedKeywords }, function() {
        document.getElementById("keyword").value = "";
        // Notify content script to update the blocked keywords
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "updateBlockedKeywords", keywords: blockedKeywords });
        });
      });
    });
  }
}

function clearKeywords() {
  chrome.storage.local.set({ blockedKeywords: [] }, function() {
    // Notify content script to update the blocked keywords
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "updateBlockedKeywords", keywords: [] });
    });
  });
}

document.getElementById("add-btn").addEventListener("click", addKeyword);
document.getElementById("clear-btn").addEventListener("click", clearKeywords);
