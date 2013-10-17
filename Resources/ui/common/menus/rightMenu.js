


function rightMenu()
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	Ti.include('ui/common/database/database.js');
	
	var appointments = getAllAppointmentsLocal();
	var activities = getAllActivitiesLocal();
	var treatments = getAllTreatmentsLocal();
	var ended=0;
	
	var window = Titanium.UI.createWindow({
  		title: 'Ended',
  		barColor: 'black',
  		top: 0,
  		right: 0,
  		width: 260,
  		zIndex: 1
	});
	
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(window);
	
	Ti.App.addEventListener('showMenu', function() {
		navGroupWindow.hide();
	});
	
	Ti.App.addEventListener('showLog', function() {
		navGroupWindow.show();
	});
	
	rightMenu_table = Ti.UI.createTableView({
		backgroundColor: 'red',
		borderColor: 'black',
		rowHeight: 100
	});
	window.add(rightMenu_table);
	fillTable();
	
	
	rightMenu_table.addEventListener('click', function(e) {
		if(e.row.type === 'appointment') {
			var appointment_form = require('ui/common/forms/appointment_form');
			appointment_form = new appointment_form(e.row.object);
			appointment_form.open();
			
			appointment_form.addEventListener('close', function() {
				var result = getAppointmentLocal(e.row.object.id);
				if(result.length == 0) return;
				if(result[0].status != 'Scheduled') {
					rightMenu_table.deleteRow(e.row);
					ended--;
					Ti.App.fireEvent('endedCount', { count: ended });
					Titanium.App.Properties.setInt('endedCount', ended);
				}
			});
		}
		else if(e.row.type === 'activity') {
			var activity_form = require('ui/common/forms/activity_form');
			activity_form = new activity_form(e.row.object);
			activity_form.open();
			
			activity_form.addEventListener('close', function() {
				var result = getActivityLocal(e.row.object.id);
				if(result.length == 0) return;
				if(result[0].status != 'Scheduled') {
					rightMenu_table.deleteRow(e.row);
					ended--;
					Ti.App.fireEvent('endedCount', { count: ended });
					Titanium.App.Properties.setInt('endedCount', ended);
				}
			});
		}
		else if(e.row.type === 'treatment') {
			var treatment_form = require('ui/common/forms/treatment_form');
			treatment_form = new treatment_form(e.row.object);
			treatment_form.open();
			
			treatment_form.addEventListener('close', function() {
				var result = getTreatmentLocal(e.row.object.id);
				if(result.length == 0) return;
				if(result[0].status != 'Scheduled') {
					rightMenu_table.deleteRow(e.row);
					ended--;
					Ti.App.fireEvent('endedCount', { count: ended });
					Titanium.App.Properties.setInt('endedCount', ended);
				}
			});
		} 
	});
	
	function fillTable()
	{
		var date = new Date();
		
		for(x in appointments) {
			if(date > new Date(appointments[x].date+' '+appointments[x].time) && appointments[x].status === 'Scheduled') {
				var record_id = getEntryLocal(appointments[x].entry_id)[0].record_id;
				var individual_id = getRecordLocal(record_id)[0].child_id;
				var individual = getChildLocal(individual_id)[0];
				var row = Ti.UI.createTableViewRow({ type: 'appointment', object: appointments[x] });
				row.add(Ti.UI.createLabel({ text: "The date for "+individual.first_name+' '+individual.last_name+"'s appointment "+
													"with Dr. "+appointments[x].doctor.name+" has passed", textAlign: 1, width: '90%' }));
				
				if(rightMenu_table.data.length == 0) rightMenu_table.appendRow(row);
				else rightMenu_table.insertRowBefore(0, row);
				ended++;									
			}
		}
		
		for(x in activities) {
			if(!isValidDate(activities[x].end_date) && activities[x].status === 'Scheduled') {
				var record_id = getEntryLocal(activities[x].entry_id)[0].record_id;
				var individual_id = getRecordLocal(record_id)[0].child_id;
				var individual = getChildLocal(individual_id)[0];
				var row = Ti.UI.createTableViewRow({ type: 'activity', object: activities[x] });
				row.add(Ti.UI.createLabel({ text: "An activity you scheduled for "+individual.first_name+" "+ 
													individual.last_name+" has passed its end date", textAlign: 1, width: '90%' }));
				if(rightMenu_table.data.length == 0) rightMenu_table.appendRow(row);
				else rightMenu_table.insertRowBefore(0, row);
				ended++;									
			}
		}
		
		for(x in treatments) {
			if(!isValidDate(activities[x].end_date) && treatments[x].status === 'Scheduled') {
				var record_id = getEntryLocal(treatments[x].entry_id)[0].record_id;
				var individual_id = getRecordLocal(record_id)[0].child_id;
				var individual = getChildLocal(individual_id)[0];
				var row = Ti.UI.createTableViewRow({ type: 'treatment', object: treatments[x] });
				row.add(Ti.UI.createLabel({ text: "A treatment you scheduled for "+individual.first_name+" "+ 
													individual.last_name+" has passed its end date", textAlign: 1, width: '90%' }));
				if(rightMenu_table.data.length == 0) rightMenu_table.appendRow(row);
				else rightMenu_table.insertRowBefore(0, row);
				ended++;									
			}
		}
		Ti.App.fireEvent('endedCount', { count: ended });
		Titanium.App.Properties.setInt('endedCount', ended);
	}
	
	
	return navGroupWindow;
}

module.exports = rightMenu;