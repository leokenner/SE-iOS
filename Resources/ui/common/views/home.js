

function home(input, navGroup) {

	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/database/database.js');

var entries;
var appointments;
var activities;
var treatments;	
var todays_events=0;	
	
//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row 
	//-3 means there are no rows in the array and this should be appended
	//designed to order records according to date/time with most recent first
	//-2 means do not insert
	function getIndex(date_time)
	{
		var array = (table.data[0])?table.data[0].rows:[];
		date = date_time;
		
		if(array.length == 0) return -3;
		
		var start = 0;
		var end = array.length-1;
		var mid = Math.floor(array.length/2);
		
		while(1)
		{
			if(date == array[mid].object.updated_at) return mid;
			if(start >= end) {
				if(date < array[end].object.updated_at) {
					return end;
				}
				else {
					return start-1;
				}
			}
			if(date >= array[start].object.updated_at) {
				if(date != array[start].object.updated_at) {
					return start-1;
				}
			}
			if(date < array[end].object.updated_at) return end;
			if(date < array[mid].object.updated_at) {
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
	
function loadEntry(entry)
{
	var row = require('ui/common/views/home/entries');
	row = new row(entry, navGroup);
	
	var index = getIndex(entry.updated_at);
	if(index == -3) {
		table.appendRow(row, {animated: true, });
	}
	else if(index == -1) {
		table.insertRowBefore(0, row, { animated: true, });
	}
	else {
		table.insertRowAfter(index, row, {animated: true, })
	}
}

function loadAppointment(appointment)
{
	if(areDatesEqual(appointment.date)) todays_events++;
	
	var row = require('ui/common/views/home/appointments');
	row = new row(appointment, navGroup);
	
	var index = getIndex(appointment.updated_at);
	if(index == -3) {
		table.appendRow(row, {animated: true, });
	}
	else if(index == -1) {
		table.insertRowBefore(0, row, { animated: true, });
	}
	else {
		table.insertRowAfter(index, row, {animated: true, })
	}
}

function loadActivity(activity)
{
	
	var row = require('ui/common/views/home/activities');
	row = new row(activity, navGroup);
	
	var index = getIndex(activity.updated_at);
	if(index == -3) {
		table.appendRow(row, {animated: true, });
	}
	else if(index == -1) {
		table.insertRowBefore(0, row, { animated: true, });
	}
	else {
		table.insertRowAfter(index, row, {animated: true, })
	}
}

function loadTreatment(treatment)
{
	var row = require('ui/common/views/home/treatments');
	row = new row(treatment, navGroup);
	
	var index = getIndex(treatment.updated_at);
	if(index == -3) {
		table.appendRow(row, {animated: true, });
	}
	else if(index == -1) {
		table.insertRowBefore(0, row, { animated: true, });
	}
	else {
		table.insertRowAfter(index, row, {animated: true, })
	}
}	

var self = Titanium.UI.createView({
  backgroundColor:'white',
});
self.result=null;

if(!navGroup) { 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroup = (navGroupWindow.getChildren())[0];
		navGroupWindow.result = null;
}

function getNavGroup()
{
	if(navGroupWindow) return (navGroupWindow.getChildren())[0];
	else return navGroup; 
}


var main_buttons = Ti.UI.createView({
	top: 0,
	width: '100%',
	height: 50,
	backgroundColor: '#D4CFCF',
	layout: 'horizontal',
});

var event_btn = Ti.UI.createView({
	width: '50%',
	borderColor: 'black',
	borderWidth: 1,
});
var event_txt = Ti.UI.createLabel({
	text: 'New Event',
	color: 'black',
	font: { fontSize: 15 },
});
event_btn.add(event_txt);
main_buttons.add(event_btn);

var textEntry_btn = Ti.UI.createView({
	width: '50%',
	borderColor: 'black',
	borderWidth: 1,
});
var textEntry_txt = Ti.UI.createLabel({
	text: 'New Entry',
	color: 'black',
	font: { fontSize: 15 },
});
textEntry_btn.add(textEntry_txt);
main_buttons.add(textEntry_btn);

self.add(main_buttons);

var searchBar = Ti.UI.createSearchBar({
	hintText: 'Search entries and events'
});

var table = Titanium.UI.createTableView({
	borderColor: 'black',
	separatorColor: 'black',
	top: 50,
	showVerticalScrollIndicator: false,
	search: searchBar,
	filterAttribute: 'filter',
});

var headerView = Ti.UI.createView({
	backgroundColor: 'blue',
	height: 80,
});
var headerText = Ti.UI.createLabel({ text: "Today's Events", color: 'white', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var right_arrow = Ti.UI.createImageView({
		image: 'right_arrow.png',
		right: 10,
		width: 20,
		height: 20,
	});
headerView.add(headerText);
headerView.add(right_arrow);

if(todays_events > 0) table.setHeaderView(headerView);

var explanation_label = Ti.UI.createView({
	backgroundColor: 'white',
	top: 50,
	zIndex: 2,
});
var explanation_text = Ti.UI.createLabel({ width: 230,
											textAlign: 'center',
											text: "This is your StarsEarth home screen. From here you can view and manage "+
													"all the latest information regarding the events and entries of the individuals that you care for. "+
													"If you would like to add new events/entries, you can use the buttons above. The New "+
													"Event button allows you to schedule appointments, activities and treatments, and the New "+
													"Entry button allows you to add a new entry.\n\n Please tap here for details of StarsEarth features",
										});			
explanation_label.add(explanation_text);
self.add(explanation_label);
explanation_label.hide();

explanation_text.addEventListener('click', function() {
	var helpSection = require('ui/common/help_section/helpSection');
	helpSection = new helpSection();
	helpSection.open();
});

var actionDialog = Titanium.UI.createOptionDialog({
    options: ['New Activity','New Treatment','New Appointment','Cancel'],
    cancel:3
});

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		var activity_form = require('ui/common/forms/activity_form');
		var activity = { 

			};
		activity_form = new activity_form(activity, navGroup);
		(getNavGroup()).open(activity_form);
			
			activity_form.addEventListener('close', function() {
				if(activity_form.result) {
					loadActivity(getActivityLocal(activity_form.result.id)[0]);
					explanation_label.hide();
				}
			}); 
	}
	
	if(e.index == 1) {
		var treatment_form = require('ui/common/forms/treatment_form');
		var treatment = { 

			};
		treatment_form = new treatment_form(treatment, navGroup); 
		(getNavGroup()).open(treatment_form);
			
			treatment_form.addEventListener('close', function() {
				if(treatment_form.result) {
					loadTreatment(getTreatmentLocal(treatment_form.result.id)[0]);
					explanation_label.hide();
				}
			});
	}
	
	if(e.index == 2) {
		var appointment_form = require('ui/common/forms/appointment_form');
		var appointment = { 
			
			};
		appointment_form = new appointment_form(appointment, navGroup); 
		(getNavGroup()).open(appointment_form);
			
			appointment_form.addEventListener('close', function() {
				if(appointment_form.result) {
					loadAppointment(getAppointmentLocal(appointment_form.result.id)[0]);
					explanation_label.hide();
				}
			});
	}
});

event_btn.addEventListener('click', function() {
	actionDialog.show({ view: event_btn });
});

textEntry_btn.addEventListener('click', function() {
	var entry_form = require('ui/common/forms/entry_form');
	var entry = {
		
	}
	entry_form = new entry_form(entry, navGroup);
	(getNavGroup()).open(entry_form);
			
	entry_form.addEventListener('close', function() {
		if(entry_form.result) {
			loadEntry(getEntryLocal(entry_form.result.id)[0]);
			explanation_label.hide();
		}
	});
});

self.add(table);

var load_page =  function() {
	if(Titanium.App.Properties.getString('child')) return;
	
	for(x in table.data) table.deleteSection(x);
	entries = getAllEntriesLocal();
	appointments = getAllAppointmentsLocal();
	activities = getAllActivitiesLocal();
	treatments = getAllTreatmentsLocal();
		
	for(x in entries) loadEntry(entries[x]);
	for(x in appointments) loadAppointment(appointments[x]);
	for(x in activities) loadActivity(activities[x]);
	for(x in treatments) loadTreatment(treatments[x]);
	
	if((entries.length + appointments.length + activities.length + treatments.length) == 0) explanation_label.show();
	else explanation_label.hide();
}

self.addEventListener('postlayout', load_page);
Ti.App.addEventListener('changeUser', load_page);

table.addEventListener('click', function(e) {
	var row = e.row;
	var object = e.row.object;
	var type = e.row.type;
	var window = e.row.next;
	
	window.addEventListener('close', function() {
		table.deleteRow(row);
		if(type === 'entry') {
			var the_entry = getEntryLocal(object.id);
			if(the_entry.length > 0) {
				loadEntry(the_entry[0]);
			}
		}
		else if(type === 'appointment') {
			var the_appointment = getAppointmentLocal(object.id);
			if(the_appointment.length > 0) {
				loadAppointment(the_appointment[0]);
			}
		}
		else if(type === 'activity') {
			var the_activity = getActivityLocal(object.id);
			if(the_activity.length > 0) {
				loadActivity(the_activity[0]);
			}
		}
		else if(type === 'treatment') {
			var the_treatment = getTreatmentLocal(object.id);
			if(the_treatment.length > 0) {
				loadTreatment(the_treatment[0]);
			}
		}
		
		var entries = getAllEntriesLocal();
		var appointments = getAllAppointmentsLocal();
		var activities = getAllActivitiesLocal();
		var treatments = getAllTreatmentsLocal();
		
		if((entries.length + appointments.length + activities.length + treatments.length) == 0) explanation_label.show();
		else explanation_label.hide(); 
	});
});

table.addEventListener('arrowClicked', function(e) {
	var window = e.next;
	
	window.addEventListener('close', function() {
		load_page();
	});
});


	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = home;