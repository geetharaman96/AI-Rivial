let blockedKeywords = [];

function blockContent() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === "childList") {
        const nodes = mutation.target.querySelectorAll("*");
        nodes.forEach(function(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            blockedKeywords.forEach(function(keyword) {
              if (
                node.textContent.toLowerCase().includes(keyword.toLowerCase())
              ) {
                node.parentNode.style.filter = "blur(5px)";
              }
            });
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "getBlockedKeywords") {
    sendResponse({ keywords: blockedKeywords });
  }
});

chrome.storage.local.get({ blockedKeywords: [] }, function(result) {
  blockedKeywords = result.blockedKeywords;
  blockContent();
});
