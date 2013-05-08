

function profile(child)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/database/database.js');
		
	var win = Ti.UI.createWindow({
		title: 'Child Profile',
		backgroundColor: 'white'
	});
	win.hideTabBar();
	
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(win);
	navGroupWindow.result = null;
	
	var cancel_btn = Ti.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
	});
	win.leftNavButton = cancel_btn;
	
	cancel_btn.addEventListener('click', function() {
		navGroupWindow.close();
	});
	
	var save_btn = Ti.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.SAVE
	});
	win.rightNavButton = save_btn;
	
	save_btn.addEventListener('click', function() {
		if(table.scrollable == false) { return; }
	var fname = false,
    	lname = false;	
	var onlyLetters = /^[a-zA-Z]*$/.test(first_name.value);
	if(first_name.value != null && first_name.value.length > 1 && onlyLetters) { fname = true; }
	else { alert('First name must be longer than one character and contain only letters'); }
	onlyLetters = /^[a-zA-Z]*$/.test(last_name.value);
	if(last_name.value != null && last_name.value.length > 1 && onlyLetters) { lname = true; }	
	else { alert('Last name must be longer than one character and contain only letters'); }
		
	if(fname && lname) {
		updateChildLocal(child.id,first_name.value,last_name.value,sex.text,date_of_birth.text,diagnosis.value);
		//Prev relation was unknown. New relation is known. 
		//This shows that the relationship was changed for the first time. 
		//Therefore insert new
		if(child.relationship.relation.charAt(0) == 'R' && fmember_rel.text.charAt(0) != 'R') {
			var row_id = insertRelationshipLocal(child.id,child.relationship.id,fmember_rel.text);
		}
		//If the current value is not the same as the previous value, update
		else if(child.relationship.relation != fmember_rel.text) {
			updateRelationshipLocal(child.id,child.relationship.id,fmember_rel.text);
		}
 
		child.first_name = first_name.value,
		child.last_name = last_name.value,
		child.sex = sex.text,
		child.date_of_birth = date_of_birth.text,
		child.diagnosis = diagnosis.value,
		child.relationship.relation = fmember_rel.text,
		
		navGroupWindow.result = child;
		Ti.App.fireEvent('profileChanged');
		navGroupWindow.close();
	}	
	});
	
	
	var table = Ti.UI.createTableView({
		style: 1,
		rowHeight: 45,
	});
	
	var sectionMain = Ti.UI.createTableViewSection();
	sectionMain.add(Ti.UI.createTableViewRow());
	sectionMain.add(Ti.UI.createTableViewRow());
	sectionMain.add(Ti.UI.createTableViewRow());
	//sectionMain.add(Ti.UI.createTableViewRow());
	sectionMain.add(Ti.UI.createTableViewRow());
	
	var lastName_title = Titanium.UI.createLabel({ text: 'Last Name', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var last_name = Ti.UI.createTextField({ hintText: 'Last Name', value: child.last_name, left: '45%', width: '55%' });
	var firstName_title = Titanium.UI.createLabel({ text: 'First Name', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var first_name = Ti.UI.createTextField({ hintText: 'First Name', value: child.first_name, left: '45%', width: '55%' });
	var sex_title = Titanium.UI.createLabel({ text: 'Sex', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var sex = Ti.UI.createLabel({ 
		text: child.sex?child.sex:'Unknown', 
		left: '45%', 
		width: '55%' 
		});
	var dateOfBirth_title = Titanium.UI.createLabel({ text: 'Date of Birth', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var date_of_birth = Ti.UI.createLabel({ 
		text: child.date_of_birth?child.date_of_birth:new Date().toDateString().slice(4), 
		left: '45%', 
		width: '55%' 
		});
	var diagnosis_title = Titanium.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var diagnosis = Ti.UI.createTextField({ 
		hintText: 'Enter diagnosis',
		value: child.diagnosis?child.diagnosis:null,
		left: '45%', 
		width: '55%' 
		});
	
	sectionMain.rows[0].add(firstName_title);
	sectionMain.rows[0].add(first_name);
	sectionMain.rows[1].add(lastName_title);
	sectionMain.rows[1].add(last_name);
	sectionMain.rows[2].add(sex_title);
	sectionMain.rows[2].add(sex);
	//sectionMain.rows[3].add(dateOfBirth_title);
	//sectionMain.rows[3].add(date_of_birth);
	sectionMain.rows[3].add(diagnosis_title);
	sectionMain.rows[3].add(diagnosis);
	
	
	var sectionFamily = Ti.UI.createTableViewSection({ headerTitle: 'Parents' });
	sectionFamily.add(Ti.UI.createTableViewRow({ height: 60 }));
	
	var fmember_name = Ti.UI.createLabel({ text: child.relationship.name, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5 });
	var fmember_rel = Ti.UI.createLabel({ text: child.relationship.relation, font: { fontSize: 15 }, left: 10, top: 25 });
	
	sectionFamily.rows[0].add(fmember_name);
	sectionFamily.rows[0].add(fmember_rel);
	
	table.data = [sectionMain,sectionFamily];
	
	win.add(table);
	
	
	
function changeDate(object)
{
var modalPicker = require('ui/common/helpers/modalPicker');
modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE,'DOB',object.text); 

if(win.leftNavButton != null) { 
	win.leftNavButton.setTouchEnabled(false);
}
win.rightNavButton.setTouchEnabled(false); 
win.setTouchEnabled(false);
table.scrollable = false;
if(Titanium.Platform.osname == 'iphone') modalPicker.open();
if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: object, });


var picker_closed = function() {
	if(modalPicker.result) { 
		var newDate = modalPicker.result.toDateString().slice(4);
		object.text = newDate;
	}
	win.setTouchEnabled(true);
	if(win.leftNavButton != null) { 
		win.leftNavButton.setTouchEnabled(true);
	}
	win.rightNavButton.setTouchEnabled(true); 
	table.scrollable = true;
	};
	
	if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
	if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
}


function launchModalPicker(data,object) {
var modalPicker = require('ui/common/helpers/modalPicker');
modalPicker = new modalPicker(null,data,object.text); 

if(win.leftNavButton != null) { 
	win.leftNavButton.setTouchEnabled(false);
}
win.rightNavButton.setTouchEnabled(false); 
win.setTouchEnabled(false);
table.scrollable = false;
if(Titanium.Platform.osname == 'iphone') modalPicker.open();
if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: object, });


var picker_closed = function() {
	if(modalPicker.result) { 
		object.text = modalPicker.result;
	}
	win.setTouchEnabled(true);
	if(win.leftNavButton != null) { 
		win.leftNavButton.setTouchEnabled(true);
	}
	win.rightNavButton.setTouchEnabled(true); 
	table.scrollable = true;
	};
	
	if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
	if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
}


date_of_birth.addEventListener('click', function() {
	changeDate(date_of_birth);
});

sex.addEventListener('click', function() {
	var data = [];
	data[0] = 'Male';
	data[1] = 'Female';
	launchModalPicker(data,sex);
});

sectionFamily.addEventListener('click', function(e) {
	var data = [];
	data[0] = 'Mother';
	data[1] = 'Father';
	data[2] = 'Brother';
	data[3] = 'Sister';
	data[4] = 'Legal Guardian';
	data[5] = 'Caregiver';
	launchModalPicker(data,e.row.children[1]);
});


return navGroupWindow;	
	
}

module.exports = profile;
