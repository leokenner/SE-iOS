
/**
 * input: the parent entry or appointment 
 * input.activities: array of existing activity objects
 * input.treatments: array of existing treatment objects
 */


function prescription(input) {

	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/list.js');
	Ti.include('ui/common/database/database.js');

//var navGroupWindow = input.navGroupWindow;
var treatments = input.treatments?input.treatments:[];
var activities = input.activities?input.activities:[];	
	
var symptoms_list='';
var activities_list='';

function getBackgroundColor(the_input)
{
	if(the_input.successful == true) {  //It is was declared successful
		return 'white';
	}
	else if(isValidDate(the_input.end_date)) {  //If the treatment is still in progress
		return 'yellow';
	}
	else { 
		return 'red';   							//If the treatment has ended and an outcome has not been entered
	}
	
	return 'white';
}

	
function loadTreatments()
{
	for(var i=0;i < treatments.length; i++) 
	{
		var medication = Titanium.UI.createLabel({ text: treatments[i].medication, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5 });
		
		symptoms_list = '';
		var length = (treatments[i].symptoms.length<2)?treatments[i].symptoms.length:2;
		for(var j=0;j < length;j++) { 
			symptoms_list += treatments[i].symptoms[j];
			if(j != length-1) symptoms_list += ', '; 
		}
		var difference = treatments[i].symptoms.length - j;
		if(difference > 0) { symptoms_list += ' and '+difference+' more'; } 
		
		var symptom = Titanium.UI.createLabel({ text: symptoms_list, font: { fontSize: 15 }, left: 10, top: 25 });
		var background_color = getBackgroundColor(treatments[i]);
		sectionTreatments.add(Ti.UI.createTableViewRow({ height: 60, backgroundColor: background_color, selectedBackgroundColor: 'white', hasChild: true, index: i }));
		sectionTreatments.rows[i].add(medication);
		sectionTreatments.rows[i].add(symptom);
	}
	
	for(var i=0;i < activities.length; i++) 
	{	
		var main_activity = Titanium.UI.createLabel({ text: activities[i].main_activity, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5, height: 20, width: '70%' });
		
		activities_list = '';
		var length = (activities[i].goals.length < 4)?activities[i].goals.length:4;
		for(var j=0;j < length;j++) { 
			activities_list += activities[i].goals[j];
			if(j != length-1) activities_list += ', ';  
		}
		var difference = activities[i].goals.length - j;
		if(difference > 0) { activities_list += ' and '+difference+' more'; } 
		
		var goal = Titanium.UI.createLabel({ text: activities_list, font: { fontSize: 15 }, left: 10, top: 25, });
		var background_color = getBackgroundColor(activities[i]);
		sectionActivities.add(Ti.UI.createTableViewRow({ height: 60, backgroundColor: background_color, selectedBackgroundColor: 'white', hasChild: true, index: i }));
		sectionActivities.rows[i].add(main_activity);
		sectionActivities.rows[i].add(goal);
	}
	if(treatments.length > 0) sectionTreatments.headerTitle = 'Treatments';
	if(activities.length > 0) sectionActivities.headerTitle = 'Activities';
	
	table.data = [sectionActivities,sectionTreatments];
}	
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Actions',
  height: 'auto'
});

var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(self);
	navGroupWindow.result = null;

var close_btn = Titanium.UI.createButton({
	title: 'Close',
});

close_btn.addEventListener('click', function() {
	input.activities = activities;
	input.treatments = treatments;
	navGroupWindow.result = input;
	navGroupWindow.close();
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
		activity_form = new activity_form({navGroupWindow: navGroupWindow, activity: activity });
		var children = navGroupWindow.getChildren();
		children[0].open(activity_form); //open the prescription window in the navgroup  
			
			activity_form.addEventListener('close', function() {
				children[0].remove(activity_form);
				if(activity_form.result != null)
				{
					if(activity_form.result == -1)  { return; }
					
					var main_activity = Titanium.UI.createLabel({ text: activity_form.result.main_activity, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5, height: 20, width: '70%' });
					
					activities_list = '';
					var length = (activity_form.result.goals.length < 4)?activity_form.result.goals.length:4;
					for(var j=0;j < length;j++) { 
						activities_list += activity_form.result.goals[j]; 
						if(j != length-1) activities_list += ', '; 
					}
					var difference = activity_form.result.goals.length - j;
					if(difference > 0) { activities_list += ' and '+difference+' more'; } 
		
					var goal = Titanium.UI.createLabel({ text: activities_list, font: { fontSize: 15 }, left: 10, top: 25, });
					activities.push(activity_form.result);
					sectionActivities.add(Ti.UI.createTableViewRow({ height: 60, backgroundColor: 'yellow', selectedBackgroundColor: 'white', hasChild: true, index: activities.length-1 }));
					sectionActivities.rows[sectionActivities.rowCount-1].add(main_activity);
					sectionActivities.rows[sectionActivities.rowCount-1].add(goal);
					
					sectionActivities.headerTitle = 'Activities';
					table.data = [sectionActivities,sectionTreatments];
				}
			});
	}
	
	if(e.index == 1) {
		var treatment_form = require('ui/common/forms/treatment_form');
		var treatment = { 
			entry_id: input.entry_id?input.entry_id:null, 
			appointment_id: input.appointment_id?input.appointment_id:null, 
			};
		treatment_form = new treatment_form({navGroupWindow: navGroupWindow, treatment: treatment });
		var children = navGroupWindow.getChildren();
		children[0].open(treatment_form); //open the prescription window in the navgroup  
			
			treatment_form.addEventListener('close', function() {
				children[0].remove(treatment_form);
				if(treatment_form.result != null)
				{
					if(treatment_form.result == -1)  { return; }
					medication = Titanium.UI.createLabel({ text: treatment_form.result.medication, font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5 });
		
					symptoms_list = '';
					var length = (treatment_form.result.symptoms.length<2)?treatment_form.result.symptoms.length:2;
					for(var j=0;j < length;j++) { 
						symptoms_list += treatment_form.result.symptoms[j]; 
						if(j != length-1) symptoms_list += ', '; 
					}
					var difference = treatment_form.result.symptoms.length - j;
					if(difference > 0) { symptoms_list += ' and '+difference+' more'; } 
		
					symptom = Titanium.UI.createLabel({ text: symptoms_list, font: { fontSize: 15 }, left: 10, top: 25 });
					treatments.push(treatment_form.result);
					sectionTreatments.add(Ti.UI.createTableViewRow({ height: 60, backgroundColor: 'yellow', selectedBackgroundColor: 'white', hasChild: true, index: treatments.length-1 }));
					sectionTreatments.rows[sectionTreatments.rowCount-1].add(medication);
					sectionTreatments.rows[sectionTreatments.rowCount-1].add(symptom);
					
					sectionTreatments.headerTitle = 'Treatments';
					table.data = [sectionActivities,sectionTreatments];
				}
			});
	}
});

add_btn.addEventListener('click', function() {
	actionDialog.show();
});



var table = Titanium.UI.createTableView({
	width: '99%',
	showVerticalScrollIndicator: false,
	rowHeight: 45,
	style: 1
});

var sectionActivities = Ti.UI.createTableViewSection();
var sectionTreatments = Ti.UI.createTableViewSection();
loadTreatments();

self.add(table);

sectionTreatments.addEventListener('click', function(e) {
		var treatment_form = require('ui/common/forms/treatment_form');
			treatments[e.rowData.index].entry_id = input.entry?input.entry.id:null, 
			treatments[e.rowData.index].appointment_id = input.appointment?input.appointment.id:null,
			treatments[e.rowData.index].navGroupWindow = navGroupWindow;
			treatment_form = new treatment_form({ navGroupWindow: navGroupWindow, treatment: treatments[e.rowData.index] });
			var children = navGroupWindow.getChildren();
				children[0].open(treatment_form); //open the prescription window in the navgroup  	
			
			treatment_form.addEventListener('close', function() {
				if(treatment_form.result != null)
				{
					if(treatment_form.result == -1) {
						sectionTreatments.remove(e.row);
						treatments.splice(e.rowData.index,1);
						for(var i=e.rowData.index; i < treatments.length; i++) { sectionTreatments.rows[i].index = i; }
						if(treatments.length == 0) sectionTreatments.headerTitle = '';
						table.data = [sectionActivities,sectionTreatments];
						return;
					}
					
					e.rowData.backgroundColor = getBackgroundColor(treatment_form.result);
					
					treatments[e.rowData.index] = treatment_form.result;
					e.row.children[0].text = treatment_form.result.medication;
		
					symptoms_list = '';
					var length = (treatment_form.result.symptoms.length<2)?treatment_form.result.symptoms.length:2;
					for(var j=0;j < length;j++) { 
						symptoms_list += treatment_form.result.symptoms[j]; 
						if(j != length-1) symptoms_list += ', '; 
					}
					var difference = treatment_form.result.symptoms.length - j;
					if(difference > 0) { symptoms_list += ' and '+difference+' more'; }
					e.row.children[1].text = symptoms_list;
					
					table.data = [sectionActivities,sectionTreatments];
				}
			});
});


sectionActivities.addEventListener('click', function(e) {
	var activity_form = require('ui/common/forms/activity_form');
			activities[e.rowData.index].entry_id = input.entry_id?input.entry_id:null, 
			activities[e.rowData.index].appointment_id = input.appointment_id?input.appointment_id:null,
			activities[e.rowData.index].navGroupWindow = navGroupWindow;
			activity_form = new activity_form({ navGroupWindow: navGroupWindow, activity: activities[e.rowData.index] });
			var children = navGroupWindow.getChildren();
				children[0].open(activity_form); //open the prescription window in the navgroup  	
			
			activity_form.addEventListener('close', function() {
				if(activity_form.result != null)
				{
					if(activity_form.result == -1) {
						sectionActivities.remove(e.row);
						activities.splice(e.rowData.index,1);
						for(var i=e.rowData.index; i < activities.length; i++) { sectionActivities.rows[i].index = i; }
						if(activities.length == 0) sectionActivities.headerTitle='';
						table.data = [sectionActivities,sectionTreatments];
						return;
					}
					
					e.rowData.backgroundColor = getBackgroundColor(activity_form.result);
					activities[e.rowData.index] = activity_form.result;
					e.row.children[0].text = activity_form.result.main_activity;
					
					activities_list = '';
					var length = (activity_form.result.goals.length < 4)?activity_form.result.goals.length:4;
					for(var j=0;j < length;j++) { 
						activities_list += activity_form.result.goals[j]; 
						if(j != length-1) activities_list += ', '; 
					}
					var difference = activity_form.result.goals.length - j;
					if(difference > 0) { activities_list += ' and '+difference+' more'; } 
					e.row.children[1].text = activities_list;
					
					table.data = [sectionActivities,sectionTreatments];
				}
			});
});


	return navGroupWindow;
};

module.exports = prescription;