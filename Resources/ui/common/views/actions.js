
/**
 * input: the parent entry or appointment 
 * input.appointment_id: appointment that actions are related to, if applicable
 * input.entry_id: entry that actions are related to
 */


function actions(input, navGroup) {

	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/database/database.js');

var treatments = input.appointment_id?getTreatmentsForAppointmentLocal(input.appointment_id):getOnlyTreatmentsForEntryLocal(input.entry_id);
var activities = input.appointment_id?getActivitiesForAppointmentLocal(input.appointment_id):getOnlyActivitiesForEntryLocal(input.entry_id);	

function getBackgroundColor(the_input)
{
	if(the_input.status === 'Scheduled') {
		if(!isValidDate(the_input.end_date)) {
			return 'red';
		}
		else {   
			return 'yellow';
		}
	}
	
	return 'white';
}

//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row 
	//-3 means there are no rows in the array and this should be appended
	function getIndex(date)
	{
		var array = (table.data[0])?table.data[0].rows:[];
		date = new Date(date);
		
		if(array.length == 0) return -3;
		
		var start = 0;
		var end = array.length-1;
		var mid = Math.floor(array.length/2);
		
		while(1)
		{
			if(date == new Date(array[mid].children[1].text.split('date: ')[1])) return -2;
			if(start >= end) {
				if(date > new Date(array[end].children[1].text.split('date: ')[1])) {
					return end;
				}
				else {
					return start-1;
				}
			}
			if(date <= new Date(array[start].children[1].text.split('date: ')[1])) {
				if(date != new Date(array[start].children[1].text.split('date: ')[1])) {
					return start-1;
				}
			}
			if(date > new Date(array[end].children[1].text.split('date: ')[1])) return end;
			if(date > new Date(array[mid].children[1].text.split('date: ')[1])) {
				if(start != mid) start = mid;
				else return start;
			}
			else {
				if(start != mid) end = mid;
				else return start-1; 
			}
			mid = Math.floor((start+end)/2);
			continue;
		}
		
	}

function loadTreatment(treatment)
{
	var type = Titanium.UI.createLabel({ text: "Type: Treatment", left: 10, top: 5, });
	var date = Titanium.UI.createLabel({ text: "Start date: "+treatment.start_date, left: 10, top: 5, });
	var medication = Titanium.UI.createLabel({ text: treatment.medication, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5 });
	var background_color = getBackgroundColor(treatment);
	var row = Ti.UI.createTableViewRow({ height: 120, layout: 'vertical', backgroundColor: background_color, selectedBackgroundColor: 'white', hasChild: true, object: treatment });
	row.add(type);
	row.add(date);
	row.add(medication);
		
	var index = getIndex(treatment.start_date);
	if(index == -3) {
		table.appendRow(row);
	}
	else if(index == -1) {
		table.insertRowBefore(0, row);
	}
	else {
		table.insertRowAfter(index, row);
	}
}

function loadActivity(activity)
{
	var type = Titanium.UI.createLabel({ text: "Type: Activity", left: 10, top: 5, });
	var date = Titanium.UI.createLabel({ text: "Start date: "+activity.start_date, left: 10, top: 5, });
	var main_activity = Titanium.UI.createLabel({ text: activity.main_activity, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5, });
	var background_color = getBackgroundColor(activity);
	var row = Ti.UI.createTableViewRow({ height: 120, layout: 'vertical', backgroundColor: background_color, selectedBackgroundColor: 'white', hasChild: true, object: activity });
	row.add(type);
	row.add(date);
	row.add(main_activity);
		
	var index = getIndex(activity.start_date);
	if(index == -3) {
		table.appendRow(row);
	}
	else if(index == -1) {
		table.insertRowBefore(0, row);
	}
	else {
		table.insertRowAfter(index, row)
	}
}
	
function loadActions()
{	
	if(table.data[0]) table.deleteSection(0);
	
	for(var i=0;i < treatments.length; i++) loadTreatment(treatments[i]);
	
	for(var i=0;i < activities.length; i++) loadActivity(activities[i]);
	
	if(treatments.length == 0 && activities.length == 0) explanation_label.show(); 
}
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Actions',
});
self.result=null;

if(navGroup == undefined) { 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroupWindow.result = null;
}

function getNavGroup()
{
	if(navGroupWindow != undefined) return (navGroupWindow.getChildren())[0];
	else return navGroup; 
}

var close_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.DONE
});

close_btn.addEventListener('click', function() {
	input.activities = activities;
	input.treatments = treatments;
	self.result = input;
	if(navGroupWindow != undefined) navGroupWindow.close();
	else navGroup.close(self);
});
self.leftNavButton = close_btn;

var add_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ADD
});
self.rightNavButton = add_btn;

var actionDialog = Titanium.UI.createOptionDialog({
    options: ['New Activity','New Treatment','Cancel'],
    cancel:2
});

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		var activity_form = require('ui/common/forms/activity_form');
		var activity = { 
			entry_id: input.entry_id?input.entry_id:null, 
			appointment_id: input.appointment_id?input.appointment_id:null, 
			};
		activity_form = new activity_form(activity);
		(getNavGroup()).open(activity_form);
			
			activity_form.addEventListener('close', function() {
				if(activity_form.result != null) {
					loadActivity(getActivityLocal(activity_form.result.id));	
					//loadActivity(activity_form.result);
					explanation_label.hide();
				}
			});
	}
	
	if(e.index == 1) {
		var treatment_form = require('ui/common/forms/treatment_form');
		var treatment = { 
			entry_id: input.entry_id?input.entry_id:null, 
			appointment_id: input.appointment_id?input.appointment_id:null, 
			};
		treatment_form = new treatment_form(treatment); 
		(getNavGroup()).open(treatment_form);
			
			treatment_form.addEventListener('close', function() {
				if(treatment_form.result != null) {
					loadTreatment(getTreatmentLocal(treatment_form.result.id));
					//loadTreatment(treatment_form.result);
					explanation_label.hide();
				}
			});
	}
});

add_btn.addEventListener('click', function() {
	actionDialog.show({ view: add_btn });
});

if(input.appointment_id) {
var appointment = getAppointmentLocal(input.appointment_id);	
var doctor = getDoctorByAppointmentLocal(input.appointment_id);	
	 
var the_message = Ti.UI.createView({
	width: '100%',
	zIndex: 3,
	height: 70,
	top: 0,
	backgroundColor: 'blue',
	borderColor: 'blue'
	});
	
	the_message.add(Ti.UI.createLabel({ text: "Recommended/diagnosed by "+doctor[0].name+" on "+appointment[0].date, textAlign: 'center', color: 'white' }));
													
	if(the_message) self.add(the_message);
}

var table = Titanium.UI.createTableView({
	width: '100%',
	showVerticalScrollIndicator: false,
});
if(input.appointment_id) table.setTop(70);
else table.setTop(0);

var explanation_label = Ti.UI.createView({
	backgroundColor: 'white',
	zIndex: 2,
});
var explanation_text = Ti.UI.createLabel({ width: 230,
											textAlign: 'center',
											text: "This is where you record all the appointments that you scheduled regarding the your new entry."+
													"To record a new appointment, click the '+' button on the top right.",
										});	
if(input.appointment_id) {
	var explanation_text = Ti.UI.createLabel({ width: 230,
											textAlign: 'center',
											text: "This is where you record all the medical treatments and activities(eg: exercises) that "+
			doctor[0].name+" has prescribed. To begin entering activites/treatments, please press the '+' button on the top right of the screen",
										});	
}
else {
	var explanation_text = Ti.UI.createLabel({ width: 230,
											textAlign: 'center',
											text: "This is where you record all the medical treatments and activities(eg: exercises) that "+
			"you have administered without consulting a professional. To begin entering activites/treatments, please press the '+' button on the top right of the screen",
										});	
}
explanation_label.add(explanation_text);
self.add(explanation_label);
explanation_label.hide();

self.add(table);

var key_view = Ti.UI.createView({
	backgroundColor: 'white',
	borderColor: 'black',
	bottom: 0,
	height: 45,
	zIndex: 2,
	width: '100%',
});
var key_text = Ti.UI.createLabel({ text: 'View Key', font: { fontWeight: 'bold', fontSize: 15, }, });
key_view.add(key_text);
self.add(key_view);

key_view.addEventListener('click', function() {
	var key_table = Ti.UI.createTableView({
		rowHeight: 60,
	});
	key_table.appendRow(Ti.UI.createTableViewRow({ backgroundColor: 'white', }));
	key_table.appendRow(Ti.UI.createTableViewRow({ backgroundColor: 'yellow', }));
	key_table.appendRow(Ti.UI.createTableViewRow({ backgroundColor: 'red', }));
	key_table.data[0].rows[0].add(Ti.UI.createLabel({ text: 'Completed/Cancelled', textAlign: 1, width: '90%', }));
	key_table.data[0].rows[1].add(Ti.UI.createLabel({ text: 'Scheduled', textAlign: 1, width: '90%', }));
	key_table.data[0].rows[2].add(Ti.UI.createLabel({ text: 'Activity/Treatment end date passed,\nplease enter results', textAlign: 1, width: '90%', }));
	
	var rightButton = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.DONE, });
	rightButton.addEventListener('click', function() { key_window.close(); });
	
	var key_window = Ti.UI.createWindow({
	    title: 'Key',
	    rightNavButton: rightButton,
	});
	key_window.add(key_table);
	
	key_window.open({ modal: true, });
});

loadActions();

table.addEventListener('click', function(e) {
	if(e.row.children[0].text.split(': ')[1] === 'Activity') {
		var form = require('ui/common/forms/activity_form');
	}
	else {
		var form = require('ui/common/forms/treatment_form');
	}
	form = new form(e.row.object, navGroup);
	(getNavGroup()).open(form);
	
	form.addEventListener('close', function() {
			if(e.row.children[0].text.split(': ')[1] === 'Activity') {
				table.deleteRow(e.row);
				var activity = getActivityLocal(e.row.object.id);
				if(activity.length > 0) loadActivity(activity[0]);
			}
			else {
				table.deleteRow(e.row);
				var treatment = getTreatmentLocal(e.row.object.id);
				if(treatment.length > 0) loadTreatment(treatment[0]);
			}
	});
});

	if(navGroup == undefined) { navGroup = (navGroupWindow.getChildren())[0]; return navGroupWindow; }
	else return self;
};

module.exports = actions;