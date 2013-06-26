
/**
 * input: the parent entry or appointment 
 * input.appointment_id: appointment that actions are related to, if applicable
 * input.entry_id: entry that actions are related to
 */


function appointments(input, navGroup) {

	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/database/database.js');
	
var appointments = getAppointmentsForEntryLocal(input.entry_id);	

function getBackgroundColor(the_input)
{
	if(the_input.status === 'Scheduled') {
		if(new Date(the_input.data+' '+the_input.time) > new Date()) {
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
	function getIndex(date_time)
	{
		var array = (table.data[0])?table.data[0].rows:[];
		date = new Date(date_time);
		
		if(array.length == 0) return -3;
		
		var start = 0;
		var end = array.length-1;
		var mid = Math.floor(array.length/2);
		
		while(1)
		{
			if(date == new Date(array[mid].object.date+' '+array[mid].object.time)) return -2;
			if(start >= end) {
				if(date > new Date(array[end].object.date+' '+array[end].object.time)) {
					return end;
				}
				else {
					return start-1;
				}
			}
			if(date <= new Date(array[start].object.date+' '+array[start].object.time)) {
				if(date != new Date(array[start].object.date+' '+array[start].object.time)) {
					return start-1;
				}
			}
			if(date > new Date(array[end].object.date+' '+array[end].object.time)) return end;
			if(date > new Date(array[mid].object.date+' '+array[mid].object.time)) {
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
	
function loadAppointment(appointment)
{
	var doctor = Titanium.UI.createLabel({ text: 'Dr. '+appointment.doctor.name, left: 10, bottom: 35, });
	var dateTime = Titanium.UI.createLabel({ text: appointment.date+' '+appointment.time, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 35, });
	var background_color = getBackgroundColor(appointment);
	var row = Ti.UI.createTableViewRow({ height: 120, backgroundColor: background_color, selectedBackgroundColor: 'white', hasChild: true, object: appointment });
	row.add(doctor);
	row.add(dateTime);
		
	var index = getIndex(appointment.date+' '+appointment.time);
	if(index == -3) {
		table.appendRow(row, { animated: true, });
	}
	else if(index == -1) {
		table.insertRowBefore(0, row, { animated: true, });
	}
	else {
		table.insertRowAfter(index, row, { animated: true, })
	}
}

function loadAppointments()
{	
	for(var i=0; i < appointments.length; i++) loadAppointment(appointments[i]);
	
	if(appointments.length == 0) explanation_label.show();
}
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Appointments',
});
self.result=null;

if(navGroup == undefined) { 
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(self);
		navGroup = (navGroupWindow.getChildren())[0];
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
	if(navGroupWindow != undefined) navGroupWindow.close();
	else navGroup.close(self);
});
self.leftNavButton = close_btn;

var add_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ADD
});
self.rightNavButton = add_btn;

var actionDialog = Titanium.UI.createOptionDialog({
    options: ['New Appointment','Cancel'],
    cancel:1
});

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		var appointment_form = require('ui/common/forms/appointment_form');
		var appointment = { 
			entry_id: input.entry_id?input.entry_id:null, 
			};
		appointment_form = new appointment_form(appointment, navGroup);
		(getNavGroup()).open(appointment_form);
			
			appointment_form.addEventListener('close', function() {
				if(appointment_form.result != null) {	
					loadAppointment(getAppointmentLocal(appointment_form.result.id));
					//loadAppointment(appointment_form.result);
					explanation_label.hide();
				}
			});
	}
});

add_btn.addEventListener('click', function() {
	actionDialog.show({ view: add_btn });
});

var table = Titanium.UI.createTableView({
	width: '100%',
	showVerticalScrollIndicator: false,
});

var explanation_label = Ti.UI.createView({
	backgroundColor: 'white',
	zIndex: 2,
});
var explanation_text = Ti.UI.createLabel({ width: 230,
											textAlign: 'center',
											text: "This is where you record all the appointments that you scheduled regarding the your new entry."+
													"To record a new appointment, click the '+' button on the top right.",
										});			
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
	key_table.data[0].rows[2].add(Ti.UI.createLabel({ text: 'Appointment date passed,\nplease enter results', textAlign: 1, width: '90%', }));
	
	var rightButton = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.DONE, });
	rightButton.addEventListener('click', function() { key_window.close(); });
	
	var key_window = Ti.UI.createWindow({
	    title: 'Key',
	    rightNavButton: rightButton,
	});
	key_window.add(key_table);
	
	key_window.open({ modal: true, });
});

loadAppointments();

table.addEventListener('click', function(e) {
	var form = require('ui/common/forms/appointment_form');
	form = new form(e.row.object, navGroup);
	(getNavGroup()).open(form);
	
	form.addEventListener('close', function() {
		table.deleteRow(e.row);
		var appointment = getAppointmentLocal(e.row.object.id);
		if(appointment.length > 0) loadAppointment(appointment[0]);
	});
});

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = appointments;