

function recordbook(input, navGroup) {

	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/database/database.js');	


	//get the index at which to insert the new time
	//0 and above means insert below, -1 means insert above the first row 
	//-3 means there are no rows in the array and this should be appended
	//designed to order records according to date/time with most recent first
	function getIndex(date)
	{
		var array = (table.data[0])?table.data[0].rows:[];
		
		if(array.length == 0) return -3;
		
		var start = 0;
		var end = array.length-1;
		var mid = Math.floor(array.length/2);
		
		while(1)
		{
			if(date == getEntryBy('record_id', array[mid].object.id)[0].updated_at) return -2;
			if(start >= end) {
				if(date < getEntryBy('record_id', array[end].object.id)[0].updated_at) {
					return end;
				}
				else {
					return start-1;
				}
			}
			if(date >= getEntryBy('record_id', array[start].object.id)[0].updated_at) {
				if(date != getEntryBy('record_id', array[start].object.id)[0].updated_at) {
					return start-1;
				}
			}
			if(date < getEntryBy('record_id', array[end].object.id)[0].updated_at) return end;
			if(date < getEntryBy('record_id', array[mid].object.id)[0].updated_at) {
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
	
function getAllRecordData(record)
{
	var entries=0;
	var appointments=0;
	var activities=0;
	var treatments=0;
	
	var all_entries = getEntryBy('record_id', record.id);
	for(var i=0; i < all_entries.length; i++) {
		entries++;
		var all_activities = getActivitiesForEntryLocal(all_entries[i].id);
		var all_treatments = getTreatmentsForEntryLocal(all_entries[i].id)
		var all_appointments = getAppointmentsForEntryLocal(all_entries[i].id);
		activities += all_activities.length;
		treatments += all_treatments.length;
		appointments += all_appointments.length;
		for(var j=0;j < all_appointments.length; j++) {
			all_activities = getActivitiesForAppointmentLocal(all_appointments[j].id);
			all_treatments = getTreatmentsForAppointmentLocal(all_appointments[j].id);
			activities += all_activities.length;
			treatments += all_treatments.length;
		}		
	}
	return { entries: entries, appointments: appointments, activities: activities, treatments: treatments,
				last_updated_entry: all_entries[0], };
}	
	
function loadRecord(record)
{
	var recordData = getAllRecordData(record);
	
	var updated_date_time = jsonDateStringTimeFormatted(jsonDateToRegularDateString(recordData.last_updated_entry.updated_at));
	var updated_on = Titanium.UI.createLabel({ text: 'Updated: '+ updated_date_time.date+' '+updated_date_time.time, 
												left: 10, 
												top: 0, 
												left: 5,
												height: 40,
												font: { fontSize: 15 }, 
												});
												
	var top_line = Ti.UI.createView({ width: 250, height: 1, top: 40, left: 0, borderColor: 'black', borderWidth: 1, });
	
	var recent_entry = Titanium.UI.createLabel({ text: 'Most recent updated entry:\n '+recordData.last_updated_entry.main_entry, 
												textAlign: 1,
												left: 10, 
												top: 5,
												height: 160,
												width: '90%',
												font: { fontSize: 15 }, 
												});			
	
	var bottom_line = Ti.UI.createView({ width: 235, height: 1, bottom: 60, borderColor: 'black', borderWidth: 1, });
	
	var summary_line_1 = Ti.UI.createView({	
											width: 235,
											bottom: 30,
											height: 30,
											});	
											
	var summary_line_2 = Ti.UI.createView({	
											width: 235,
											bottom: 0,
											height: 30,
											});													
											
	var entries = Titanium.UI.createLabel({ text: 'Entries: '+recordData.entries,
											left: 0, 
											font: { fontSize: 15 }, 
										});

	var appointments = Titanium.UI.createLabel({ text: 'Appointments: '+recordData.appointments, 
											right: 0,
											font: { fontSize: 15 }, 
										});	
	var activities = Titanium.UI.createLabel({ text: 'Activities: '+recordData.activities,
											left: 0, 
											font: { fontSize: 15 }, 
										});									
	var treatments = Titanium.UI.createLabel({ text: 'Treatments: '+recordData.treatments,
											right: 0, 
											font: { fontSize: 15 }, 
										});	
										
	summary_line_1.add(entries);
	summary_line_1.add(appointments);
	summary_line_2.add(activities);
	summary_line_2.add(treatments);									
																																		
	var row = Ti.UI.createTableViewRow({ height: 300, object: record });
	row.add(updated_on);
	row.add(top_line);
	row.add(recent_entry);
	row.add(bottom_line);
	row.add(summary_line_1);
	row.add(summary_line_2);
	
	var index = getIndex(recordData.last_updated_entry.updated_at);
	if(index == -3) {
		table.appendRow(row, {animated: true, });
	}
	else if(index == -1) {
		table.insertRowBefore(0, row, { animated: true, });
	}
	else {
		table.insertRowAfter(index, row, {animated: true, })
	}
	
	explanation_label.hide();
}

function loadRecords(records)
{	
	for(x in table.data) table.deleteSection(x);
	for(var i=0; i < records.length; i++) loadRecord(records[i]);
	
	if(records.length == 0) explanation_label.show();
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

var close_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.DONE
});

close_btn.addEventListener('click', function() {
	if(navGroupWindow) navGroupWindow.close();
	else navGroup.close(self);
});
//self.leftNavButton = close_btn;

var newRecord_btn = Ti.UI.createView({
	top: 0,
	height: 50,
	borderColor: 'black',
	borderWidth: 1,
	backgroundColor: '#D4CFCF',
});
var newRecord_txt = Ti.UI.createLabel({
	text: 'Create New Record',
	color: 'black',
	font: { fontSize: 15 },
});
newRecord_btn.add(newRecord_txt);
self.add(newRecord_btn);

var table = Titanium.UI.createTableView({
	top: 50,
	showVerticalScrollIndicator: false,
});

var explanation_label = Ti.UI.createView({
	backgroundColor: 'white',
	top: 50,
	zIndex: 2,
});
var explanation_text = Ti.UI.createLabel({ width: 230,
											textAlign: 'center',
										/*	text: "This is "+input.first_name+" "+input.last_name+"'s record book. Here "+
													"you can record new entries, and schedule corresponding appointments, activities and "+
													"treatments. You can return at any time to view these records. To create a new record, press "+
													"the 'New Record' button above.", */
										});			
explanation_label.add(explanation_text);
self.add(explanation_label);
explanation_label.hide();

self.add(table);


var load_page =  function() {
	if(!Titanium.App.Properties.getString('child')) return;
	var child_id = Titanium.App.Properties.getString('child');
	var child = getChildLocal(child_id);
	explanation_text.text= "This is "+child[0].first_name+" "+child[0].last_name+"'s record book. Here "+
													"you can record new entries, and schedule corresponding appointments, activities and "+
													"treatments. You can return at any time to view these records. To create a new record, press "+
													"the 'New Record' button above.";
	records = getRecordsForChildLocal(child_id);
	loadRecords(records);
}

self.addEventListener('postlayout', load_page);
Ti.App.addEventListener('changeUser', load_page);

Ti.App.addEventListener('profileChanged', function() {
	var child_id = Titanium.App.Properties.getString('child');
	var child = getChildLocal(child_id);
	explanation_text.text= "This is "+child[0].first_name+" "+child[0].last_name+"'s record book. Here "+
													"you can record new entries, and schedule corresponding appointments, activities and "+
													"treatments. You can return at any time to view these records. To create a new record, press "+
													"the 'New Record' button above.";
});

newRecord_btn.addEventListener('click', function() {
	var entry_form = require('ui/common/forms/entry_form');
	var entry = {
		
	}
	entry_form = new entry_form(entry, navGroup);
	(getNavGroup()).open(entry_form);
			
	entry_form.addEventListener('close', function() {
		if(entry_form.result != null) {
			var the_record = getRecordLocal(entry_form.result.record_id);	
			loadRecord(the_record[0]);
			explanation_label.hide();
		}
	});
});

table.addEventListener('click', function(e) {
	var open_record = require('ui/common/views/record');
	open_record = new open_record(e.row.object, navGroup);
	(getNavGroup()).open(open_record);
	
	open_record.addEventListener('closed', function() {
		table.deleteRow(e.row);
		var record = getRecordLocal(e.row.object.id);
		if(record.length > 0) {
			loadRecord(record[0]);
			return;
		} 
		
		var all_records = getRecordsForChildLocal(Titanium.App.Properties.getString('child'));
		if(all_records.length == 0) explanation_label.show();
		
		delete open_record;
	}); 
});

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = recordbook;