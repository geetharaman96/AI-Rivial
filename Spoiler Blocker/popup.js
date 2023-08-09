var kwLen = document.querySelector("#keyword-length");
console.log(kwLen)
re = (child) => {
	child.parentNode.remove(child);
	const request = indexedDB.open("content-blocker", 1);
	request.onsuccess = (e) => {
		db = e.target.result;
		const tx = db.transaction(["cb_keywords"], "readwrite");
		const objectstore = tx.objectStore("cb_keywords");
		objectstore.delete(parseInt(child.id));
		kwLen.textContent -=1; 
	};
};
function setDOMInfo(info) {
	console.log(info);
}
function msgSender(kw) {
	// ...query for the active tab...

	// ...and send a request for the DOM info...
	chrome.runtime.sendMessage(
		{ from: "popup", subject: kw },
		setDOMInfo
	);
}

window.onload = function () {
	var butn = document.querySelector("#addButton");
	var input = document.querySelector("input");
	var keyword = document.querySelector("#keywords-list");
	
	let db = null;
	const createdb = () => {
		const request = indexedDB.open("content-blocker", 1);

		request.onupgradeneeded = (e) => {
			console.log("updatte");
			db = e.target.result;
			db.createObjectStore("cb_keywords", {
				keypath: "keyword",
				autoIncrement: true,
			});
		};

		request.onsuccess = (e) => {
			db = e.target.result;
			viewNotes(db);
		};
		request.onerror = (e) => {
			console.log("error" + e.target.errror);
		};
	};
	createdb();

	butn.addEventListener("click", () => {
		if (input.value) {
			keyword.innerHTML =
				"<div class=keyword-element>" +
				input.value +"<span class='badge  badge-pill badge-danger float-right'>New</span>"+
				"</div>" +
				keyword.innerHTML;

			const tx = db.transaction("cb_keywords", "readwrite");
			const pNotes = tx.objectStore("cb_keywords");
			var obj = { keyword: input.value };
			pNotes.add(obj);
			input.value = "";
			kwLen.textContent = parseInt(kwLen.textContent) +1;
		}
	});

	async function viewNotes(db) {
		const tx = db.transaction("cb_keywords", "readonly");
		const pNotes = tx.objectStore("cb_keywords");
		const request = pNotes.openCursor();
		var kw = [];
		request.onsuccess = (e) => {
			const cursor = e.target.result;
			if (cursor) {
				//do something with the cursor
				keyword.innerHTML =
					"<div class=keyword-element>" +
					cursor.value.keyword +
					'<button class="remove close"' +
					"id=" +
					cursor.key +
					" " +
					">X</button></div>" +
					keyword.innerHTML;
				kw.push(cursor.value.keyword);
				cursor.continue();
				console.log("continue");
			} else {
				const nodelist = document.querySelectorAll(".remove");
				const arr = [...nodelist];
				arr.map((item) => item.addEventListener("click", () => re(item)));
				console.log(kw);
				msgSender(kw);
			kwLen.textContent = kw.length;

			}
		};
	}
};
