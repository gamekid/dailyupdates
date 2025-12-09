// functions.js
// Nate Selof Oct, Nov 2011
// Added Alarms, Sept 2012
// Removed Alarms, point to new backend Sept 2025

//GLOBAL VARS///////////////////////////////////////
// timer
var timer;

//number of updates currently
var numUpdates;

//updates array
var updates = new Array();

//add function nicEditor object
var myNicEditor;

//io for toggling the add div
var isAddOpen = 0;

//io for the move edit checkbox
var moveEdit = 0;

//variables for editing
var isLock;
var workingId = -1;
var bylineTmp = "";
var editNicEditor;

////////////////////////////////////////////
// Loading

function showLoading(s) {
	var loadingHTML = "";
	if (s) loadingHTML = `<img src="img/loading50.gif" />`;
	document.getElementById('loading').innerHTML = loadingHTML;
}

////////////////////////////////////////////
//Website function

function detectView() {
	let view = getParam('view');
	if (view !== 'admin') {
		const style = document.createElement('style');
		style.textContent = `
			div.updateedit,
			div.updatedelete,
			div.headeraddbtn {
				display: none;
			}
		`;
		document.head.append(style);
	}
}

function getParam(key) {
	let search = location.search.substring(1);
	let params = search.split('&');
	for (let param of params) {
		if (param.startsWith(`${key}=`)) {
			return param.substring(key.length + 1);
		}
	}
	return null;
}

function changeAddBtn(type) {
	if (type == "update")
	{
		document.getElementById('btnAddDiv').innerHTML = `
			<input id="btnAdd" type="image" onclick="showAdd()"
			onmouseover="btnAddOver()" onmouseout="btnAddUp()" />
		`;
		btnAddUp();
	}
	else if (type == "none")
	{
		document.getElementById('btnAddDiv').innerHTML = "";
	}
}

function showAdd() {
	if(isAddOpen==1){
		hideAdd();
	}
	else
	{
		//nicEditor variable init
		myNicEditor = new nicEditor();

		var addHTML = `
			<div id="errmsg" class="errmsg"></div>
			<div id="myNicPanel" style="width:658px;"></div>
			<textarea id="addTitle" name="addTitle" cols="87" rows="1"><font face="Georgia" size="5">subject...</font></textarea>
			<div class="textarea" ><textarea id="addText" name="addText" cols="87" rows="4"><font face="Tahoma" size="2">content...</font></textarea></div>
			<div class="init">Please enter your initials: <textarea id="addInit" cols="3" rows="1"></textarea></div>
			<div class="submit"><input type="image" src="img/add_submit.png" onclick="addUpdate()" /></div>
		`;

		isAddOpen = 1;
		document.getElementById('add').innerHTML = addHTML;

		//nicEditor code
		myNicEditor.setPanel('myNicPanel');
		myNicEditor.addInstance('addText');
		myNicEditor.addInstance('addTitle');
	}
}

function hideAdd() {
	var addHTML = "&nbsp";
	isAddOpen = 0;
	document.getElementById('add').innerHTML = addHTML;
}

function btnAddUp() {
	document.getElementById('btnAdd').src = "img/add_up.png";
}

function btnAddOver() {
	document.getElementById('btnAdd').src = "img/add_over.png";
}

function btnEditUp(updateId) {
	document.getElementById("btnEdit" + updateId).src = "img/edit_up.png";
}

function btnEditOver(updateId) {
	document.getElementById("btnEdit" + updateId).src = "img/edit_over.png";
}

function btnDeleteUp(updateId) {
	document.getElementById("btnDelete" + updateId).src = "img/delete_up.png";
}

function btnDeleteOver(updateId) {
	document.getElementById("btnDelete" + updateId).src = "img/delete_over.png";
}

////////////////////////////////////////////
//Update Class

function Update(updateId,dateTime,createdAt,title,content,initials, archivedAt)
{
	this.updateId=updateId;
	this.dateTime=dateTime;
	this.createdAt=createdAt;
	this.title=title;
	this.content=content;
	this.initials=initials;
	this.archived_at=archivedAt;
} // Update::Update()

function outputUpdate(id) {
	var updateHTML = "";
	var nextId = id + 1;
	updateHTML += `
		<div class="update" id="updateId${nextId}"></div>

		<div class="editupdate" id="editUpdateId${updates[id].updateId}"></div>

		<div class="updatebylineid" id="updateBylineIdId${updates[id].updateId}">${nextId}</div>

		<div class="updatetitle" id="updateTitleId${updates[id].updateId}">
		${updates[id].title}
		</div>

		<div class="updatetopbottom">
		<img src="img/update_top.png" width="700" height="4" />
		</div>

		<div class="updatebody" id="updateBodyId${updates[id].updateId}">
		${updates[id].content}
		</div>

		<div class="updatetopbottom">
		<img src="img/update_bottom.png" width="700" height="4" />
		</div>

		<div class="updatebyline" id="updateBylineId${updates[id].updateId}"> 
		<font style="font-size:12;color:#333333;">${updates[id].dateTime}</font> 
		Initialed by ${updates[id].initials}
		</div>

		<div class="updatedelete">
		<input id="btnDelete${updates[id].updateId}" type="image" onclick="updateDelete(${id})" onmouseover="btnDeleteOver('${updates[id].updateId}')" onmouseout="btnDeleteUp('${updates[id].updateId}')" />
		</div>

		<div class="updateedit">
		<input id="btnEdit${updates[id].updateId}" type="image" onclick="updateEdit(${id})" onmouseover="btnEditOver('${updates[id].updateId}')" onmouseout="btnEditUp('${updates[id].updateId}')" />
		</div>
	`;// delete this extra tag

	document.getElementById("updateId" + id).innerHTML = updateHTML;
	btnEditUp(updates[id].updateId);
	btnDeleteUp(updates[id].updateId);
} // outputUpdate

function updateEdit(id) {
	//check for lock
	if (isLock==0){
		//set lock
		hideAdd();
		isLock = 1;
		
		//create nicEditor and set to the title and content div's
		editNicEditor = new nicEditor();
		editNicEditor.setPanel("editUpdateId" + updates[id].updateId);
		editNicEditor.addInstance("updateTitleId" + updates[id].updateId);
		editNicEditor.addInstance("updateBodyId" + updates[id].updateId);
		
		//save byline and replace with instructions
		bylineTmp = document.getElementById("updateBylineId" + updates[id].updateId).innerHTML;
		
		const updateByLineHTML = `
			<font style="font-weight:bold;" >Click EDIT again to save changes.</font>
			<span>Send to top:</span> 
			<input type="checkbox" id="editMoveCheckbox${updates[id].updateId}" />
		`;
			
		document.getElementById("updateBylineId" + updates[id].updateId).innerHTML = updateByLineHTML;

		workingId = updates[id].updateId;
	} else if (updates[id].updateId == workingId) {
		
		//check to see if we should move the update to the top
		if(document.getElementById("editMoveCheckbox" + updates[id].updateId).checked == true)
		{
			moveEdit = 1;
		} // if
	
		//remove nicEditors
		document.getElementById("editUpdateId" + updates[id].updateId).innerHTML = "";
		editNicEditor.removeInstance("updateTitleId" + updates[id].updateId);
		editNicEditor.removeInstance("updateBodyId" + updates[id].updateId);

		// grab changes
		updates[id].title = 	document.getElementById("updateTitleId" + updates[id].updateId).innerHTML;
		updates[id].content =	document.getElementById("updateBodyId" + updates[id].updateId).innerHTML;
		
		//set byline back
		document.getElementById("updateBylineId" + updates[id].updateId).innerHTML = bylineTmp;

		//unlock
		isLock = 0;
		
		if (moveEdit) {
			let d = new Date();
			updates[id].createdAt = d.toISOString();
		}

		dbSendRequest(id);
		
		moveEdit = 0;
	} // else if
} // Update::editUpdate()

////////////////////////////////////////////
// XML
// load the xml file into xmlDoc

async function dbSendRequest(id) {

	try {

		const response = await fetch("https://" + getParam("server"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ 
				action: "upsert",
				collection: getParam('collection'),
				document: {
					id: updates[id].updateId,
					date_time: updates[id].dateTime,
					created_at: updates[id].createdAt,
					title: updates[id].title,
					note: updates[id].content,
					created_by: updates[id].initials,
					archived_at: updates[id].archivedAt,
				}
			}),
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

	} catch (error) {
		console.error(error.message);
	}

	getUpdates();
}

////////////////////////////////////////////
//Error Checking functions

function checkTitle(title) {
var errmsg = "";
if (title=="") errmsg += "Please enter a title.<br />";
if (title.length > 110) 
{
	errmsg += "Your Subject entry overextends the maximum character count by " +  (title.length - 110) + ".<br />";
}
return errmsg;
}

function checkContent(content) {
var errmsg = "";
if (content=="") errmsg += "Please enter update content.<br />";
return errmsg;
}

function checkInitials(initials) {
	var errmsg = "";
	if (initials=="") errmsg += "Please enter initials.<br />";
	if (initials.length > 4) 
	{
		errmsg += "Your Initials entry overextends the maximum character count by " +  (initials.length - 4) + ".<br />";
	}
	return errmsg;
}

////////////////////////////////////////////
//Implementation

function addUpdate() {
	if (isLock==0){
		
		//remove nicEditors
		myNicEditor.removeInstance('addTitle');
		myNicEditor.removeInstance('addText');
	
		//setup and grab values
		var title = 	document.getElementById('addTitle').value;
		var content =	document.getElementById('addText').value;
		var initials =	document.getElementById('addInit').value;
		
		//error checking
		var errmsg = 	"";
		errmsg += checkTitle(title);
		errmsg += checkContent(content);
		errmsg += checkInitials(initials);
		
		//if no error, create object and output it
		if (errmsg == "") {
			hideAdd();
			let d = new Date();
			updates.push(new Update(
				null,
				d.toLocaleString(),
				d.toISOString(),
				title,
				content,
				initials,
				null,
			));
			
			// send update to server
			dbSendRequest(updates.length-1); 
		} else {
			document.getElementById("errmsg").innerHTML = errmsg;
			myNicEditor.addInstance('addText');
			myNicEditor.addInstance('addTitle');
		} // if else
	} // if locked
} // addUpdate()

function updateDelete(id) {
	//check for lock
	if(isLock==0){
		let d = new Date();
		updates[id].archivedAt = d.toISOString();
		dbSendRequest(id);
	} // if
} // updateDelete()

async function getUpdates() {
	if (timer) {
		clearTimeout(timer);
	}

	// set-up variable
	isLock=0;
	var i;	

	let server = getParam("server");
	if (!server) {
		return;
	}

	showLoading(true);

	const url = "https://" + getParam("server") + "?collection=" + getParam("collection") + "&filter[archived_at]=null";
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		// set-up add button
		changeAddBtn("update");

		// clear updates list
		updates.length = 0;

		// clear all updates html
		document.getElementById('updateId0').innerHTML="";

		const updateDocs = await response.json();
		updateDocs.sort((d1, d2) => d1.created_at > d2.created_at ? 1 : -1);

		for (let doc of updateDocs) {
			updates.push(new Update(
				doc.id,
				doc.date_time ?? doc.created_at,
				doc.created_at,
				doc.title ?? '',
				doc.note ?? '',
				doc.created_by ?? '',
				doc.archived_at ?? null,
			));
			outputUpdate(updates.length-1);
		}
	} catch (error) {
		console.error(error.message);
	}

	showLoading(false);
	timer = setTimeout(() => getUpdates(), 60000);
} // getUpdates()

//EOF