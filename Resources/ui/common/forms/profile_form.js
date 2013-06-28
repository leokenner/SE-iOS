

function profile(input, navGroup)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/database/database.js');
	
	input.sex = input.sex?input.sex:'Unknown';
	input.date_of_birth = input.date_of_birth?input.date_of_birth:new Date().toDateString().slice(4);
	input.diagnosis = input.diagnosis?input.diagnosis:'';
	for(x in input.relationships) {
		input.relationships[x].relation = input.relationships[x].relation?input.relationships[x].relation:'Relation Unknow: Tap to change';
	}
		
	var win = Ti.UI.createWindow({
		title: input.first_name+"'s Details",
		backgroundColor: 'white'
	});
	
	if(!navGroup)
	{ 
		var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(win);
		navGroup = (navGroupWindow.getChildren())[0];
	}
	
	var cancel_btn = Ti.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
	});
	win.leftNavButton = cancel_btn;
	
	cancel_btn.addEventListener('click', function() {
		if(navGroupWindow) {
			var animation = Ti.UI.createAnimation({
				top: Titanium.Platform.displayCaps.platformHeight*0.9,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
				duration: 500
			});
			navGroupWindow.animate(animation);
			animation.addEventListener('complete', function() {
				navGroupWindow.close();
			});
		}
		else navGroup.close(win);
	});
	
	var save_btn = Ti.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.SAVE
	});
	win.rightNavButton = save_btn;
	
	save_btn.addEventListener('click', function() {
	var fname = false,
    	lname = false;	
	var onlyLetters = /^[a-zA-Z]*$/.test(first_name.value);
	if(first_name.value != null && first_name.value.length > 1 && onlyLetters) { fname = true; }
	else { alert('First name must be longer than one character and contain only letters'); }
	onlyLetters = /^[a-zA-Z]*$/.test(last_name.value);
	if(last_name.value != null && last_name.value.length > 1 && onlyLetters) { lname = true; }	
	else { alert('Last name must be longer than one character and contain only letters'); }
		
	if(fname && lname) {
		updateChildLocal(input.id, 'first_name', first_name.value);
		updateChildLocal(input.id, 'last_name', last_name.value);
		updateChildLocal(input.id, 'sex', sex.text);
		updateChildLocal(input.id, 'date_of_birth', date_of_birth.text);
		updateChildLocal(input.id, 'diagnosis', diagnosis.value);
		updateRelationshipLocal(input.id,input.relationships[0].user_id,fmember_rel.text);
		
		var cloud_version = getChildMainDetailsLocal(input.id);
		Cloud.Objects.update({
				    classname: 'children',
				    id: cloud_version[0].cloud_id,
				    fields: cloud_version[0],
				}, function (e) {
				    if (e.success) {
						 updateChildLocal(input.id, 'updated_at', e.children[0].updated_at);	
				    } else {
				        Ti.API.info('Error:\n' + ((e.error && e.message) || JSON.stringify(e))+'\n Entries');
				    }
			});
		
		Ti.App.fireEvent('profileChanged');
		if(navGroupWindow) {
			var animation = Ti.UI.createAnimation({
				top: Titanium.Platform.displayCaps.platformHeight*0.9,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
				duration: 500
			});
			navGroupWindow.animate(animation);
			animation.addEventListener('complete', function() {
				navGroupWindow.close();
			});
		}
		else navGroup.close(win);
	}	
	});
	
	
	var table = Ti.UI.createTableView({
		top: 0,
		scrollable: false,
		rowHeight: 45,
	});
	
	var sectionMain = Ti.UI.createTableViewSection();
	sectionMain.add(Ti.UI.createTableViewRow());
	sectionMain.add(Ti.UI.createTableViewRow());
	sectionMain.add(Ti.UI.createTableViewRow());
	sectionMain.add(Ti.UI.createTableViewRow());
	sectionMain.add(Ti.UI.createTableViewRow());
	
	var lastName_title = Titanium.UI.createLabel({ text: 'Last Name', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var last_name = Ti.UI.createTextField({ hintText: 'Last Name', value: input.last_name, left: '45%', width: '55%' });
	var firstName_title = Titanium.UI.createLabel({ text: 'First Name', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var first_name = Ti.UI.createTextField({ hintText: 'First Name', value: input.first_name, left: '45%', width: '55%' });
	var sex_title = Titanium.UI.createLabel({ text: 'Sex', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var sex = Ti.UI.createLabel({ 
		text: input.sex, 
		left: '45%', 
		width: '55%' 
		});
	var dateOfBirth_title = Titanium.UI.createLabel({ text: 'Date of Birth', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var date_of_birth = Ti.UI.createLabel({ 
		text: input.date_of_birth, 
		left: '45%', 
		width: '55%' 
		});
	var diagnosis_title = Titanium.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var diagnosis = Ti.UI.createTextField({ 
		hintText: 'Enter diagnosis',
		value: input.diagnosis,
		left: '45%', 
		width: '55%' 
		});
	
	sectionMain.rows[0].add(firstName_title);
	sectionMain.rows[0].add(first_name);
	sectionMain.rows[1].add(lastName_title);
	sectionMain.rows[1].add(last_name);
	sectionMain.rows[2].add(sex_title);
	sectionMain.rows[2].add(sex);
	sectionMain.rows[3].add(dateOfBirth_title);
	sectionMain.rows[3].add(date_of_birth);
	sectionMain.rows[4].add(diagnosis_title);
	sectionMain.rows[4].add(diagnosis);
	
	
	var sectionFamily = Ti.UI.createTableViewSection({ headerTitle: 'Parents' });
	sectionFamily.add(Ti.UI.createTableViewRow({ height: 60 }));
	
	var user_name = getUserLocal(input.relationships[0].user_id);
	user_name = user_name[0].first_name+' '+user_name[0].last_name;
	var fmember_name = Ti.UI.createLabel({ text: user_name, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5 });
	var fmember_rel = Ti.UI.createLabel({ text: input.relationships[0].relation, font: { fontSize: 15 }, left: 10, top: 25 });
	
	sectionFamily.rows[0].add(fmember_name);
	sectionFamily.rows[0].add(fmember_rel);
	
	table.data = [sectionMain,sectionFamily];
	setTableHeight(table);
		
	win.add(table);
	
	var delete_individual = Ti.UI.createView({
		height: 50,
		width: 250,
		top: table.top+table.height+10,
		backgroundColor: 'red',
	});
	
	var delete_txt = Ti.UI.createLabel({
		color: 'white',
		text: 'Delete Record Book',
	});
	delete_individual.add(delete_txt);
	
	win.add(delete_individual);

function setTableHeight(table)
{
	var height=0;
	
	for(var i=0; i < table.data.length; i++) {
		if(table.data[i].headerView) height += table.data[i].headerView.height;
		else height += 22;
		
		for(var j=0; j < table.data[i].rows.length; j++) {
			if(table.data[i].rows[j].height) height += table.data[i].rows[j].height;
			else height += 45;
		}
	}
	table.setHeight(height);
}
	
	
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

delete_individual.addEventListener('click', function() {
	var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to delete this record book?', 
									message: 'All personal details and records will also be deleted. This cannot be undone', 
									buttonNames: ['Yes','No'], cancel: 1 });
								
		confirm.addEventListener('click', function(g) { 
   				//Clicked cancel, first check is for iphone, second for android
   				if (g.cancel === g.index || g.cancel === true) { return; }


  			 	switch (g.index) {
     		 	case 0:
     		 		if(!Titanium.Network.online) {
     		 			alert('You do not have an internet connection');
     		 			return;
     		 		}
     		 	
     		  		input.cloud_id = input.cloud_id?input.cloud_id:getChildLocal(input.id)[0].cloud_id;
					deleteChildLocal(input.id);			
					deleteObjectACS('children', input.cloud_id);
					Ti.App.fireEvent('eventSaved'); //This is to delete all related local notifications
					
      				if(navGroupWindow) {
      					var animation = Ti.UI.createAnimation({
							top: Titanium.Platform.displayCaps.platformHeight*0.9,
							curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
							duration: 500
						});
						navGroupWindow.animate(animation);
						animation.addEventListener('complete', function() {
							navGroupWindow.close();
						});
      				}
      				else navGroup.close(window);
      				break;

      		 	case 1:       			
      		 	default: break;
  				}
		});
		confirm.show();
});


if(navGroupWindow) return navGroupWindow;
else return win;	
	
}

module.exports = profile;
