re = (child) => {
	child.parentNode.remove(child);
	const request = indexedDB.open("content-blocker", 1);
	// const request = indexedDB.open("content-blocker", 1);
	request.onsuccess = (e) => {
		db = e.target.result;
		const tx = db.transaction(["cb_keywords"], "readwrite");
		const objectstore = tx.objectStore("cb_keywords");
		objectstore.delete(parseInt(child.id));
	};
};
window.addEventListener("DOMContentLoaded", function (event) {
	console.log("fished");
});

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
				input.value +
				"</div>" +
				keyword.innerHTML;

			const tx = db.transaction("cb_keywords", "readwrite");
			const pNotes = tx.objectStore("cb_keywords");
			var obj = { keyword: input.value };
			pNotes.add(obj);
			db.close();
			input.value = "";
		}
	});

	async function viewNotes(db) {
		const tx = db.transaction("cb_keywords", "readonly");
		const pNotes = tx.objectStore("cb_keywords");
		const request = pNotes.openCursor();

		request.onsuccess = (e) => {
			const cursor = e.target.result;
			if (cursor) {
				//do something with the cursor
				keyword.innerHTML =
					"<div class=keyword-element>" +
					cursor.value.keyword +
					'<button class="remove"' +
					"id=" +
					cursor.key +
					" " +
					"onclick={re(this);}" +
					">Delete</button></div>" +
					keyword.innerHTML;
				cursor.continue();
				console.log("continue");
			}
		};
	}
};
