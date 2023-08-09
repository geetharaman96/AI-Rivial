var kw = [];
getkw = async () => {
	// var kw;

	await chrome.storage.local.get(["variable"], function (data) {
		console.log(typeof data);
		if (data.variable) kw = data.variable;
		tags = "SPANEMBIULOLI";
		total = 0;
		console.log(kw);
		for (var ii = 0; ii < kw.length; ii++) {
			o = $(`:contains(${kw[ii]}):not(:has(:contains(${kw[ii]})))`);
			for (var i = 0; i < o.length; i++) {
				if (!o[i].parentNode || o[i].parentNode.nodeName === "BODY") {
					continue;
				}
				hideSpoiler(o[i]);
				total++;
			}
		}

		if (total >= 10) {
			headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
			for (var i = 0; i < headings.length; i++) hideNode(headings[i]);
		}

		function hideSpoiler(node) {
			ancestor = node.parentNode;
			if (ancestor != null) {
				if (ancestor.parentNode != null && ancestor.tagName != "BODY")
					ancestor = ancestor.parentNode;
				imgs = ancestor.getElementsByTagName("img");
				for (var i = 0; i < imgs.length; i++)
					imgs[i].style.webkitFilter = "blur(10px)";
				aTags = ancestor.getElementsByTagName("a");
				for( var i=0;i<aTags.length;i++)
					aTags[i].href = "#";
				lists = ancestor.getElementsByTagName("li");
				for (var i = 0; i < lists.length; i++) hideNode(lists[i]);
			}

			if (node == null || node.parentNode == null) return;
			all_child = node.parentNode.children;
			for (var i = 0; i < all_child; i++) {
				var type = all_child[i].tagName;
				if (tags.match(type) != null) hideNode(all_child[i]);
			}
			hideNode(node);
		}

function hideNode(node, keyword) {
  const blockedElement = document.createElement("span");
  blockedElement.textContent = node.textContent;
  blockedElement.style.color = "transparent"; // Hide the text content
  blockedElement.style.textShadow = "0 0 5px red"; // Add a shadow effect

  const replacementElement = document.createElement("span");
  replacementElement.textContent = "[SPOILER BLOCKED]";
  replacementElement.style.backgroundColor = "black";
  replacementElement.style.color = "red";
  replacementElement.style.padding = "2px 5px";
  replacementElement.style.borderRadius = "3px";
  replacementElement.style.fontWeight = "bold";

  node.innerHTML = ""; // Clear the original content
  node.appendChild(blockedElement);
  node.appendChild(replacementElement);


		}
	});
};
getkw();
// kw = ["ssr", "SSR", "Ssr"];
