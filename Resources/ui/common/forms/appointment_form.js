


function appointment(input, navGroup)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	Ti.include('ui/common/database/database.js');
	
	var appointment = {
		id: input.id?input.id:null,
		entry_id: input.entry_id?input.entry_id:null,
		diagnosis: input.diagnosis?input.diagnosis:null,
		final_diagnosis: input.final_diagnosis?input.final_diagnosis:null,
		status: input.status?input.status:'Scheduled',
		date: input.date?input.date:timeFormatted(new Date).date,
		time: input.time?input.time:timeFormatted(new Date).time,
		duration: input.duration?input.duration:{
								hours: 0,
								minutes: 0,
								},
		repeat: input.repeat?input.repeat:'once only',
		alert: input.alert?input.alert:'30 minutes before',
		categories: input.categories?input.categories:[],
		symptoms: input.symptoms?input.symptoms:[],
		additional_notes: input.additional_notes?input.additional_notes:"No additional notes",
		doctor: input.doctor?input.doctor:{
								name: null,
								location: null,
								street: null,
								city: null,
								state: null,
								zip: null,
								country: null,
								},		
	}
	
	appointment.activities = getActivitiesForAppointmentLocal(appointment.id);
	appointment.treatments = getTreatmentsForAppointmentLocal(appointment.id);
	
	var symptoms_string='';
	for(var i=0;i < appointment.symptoms.length; i++) {
		symptoms_string += appointment.symptoms[i];
		if(i != appointment.symptoms.length -1) symptoms_string += ', ';
	}
	
	var window = Titanium.UI.createWindow({
  		backgroundColor:'white',
  		title: 'Appointment',
  		layout: 'vertical',
  		height: 'auto'
	});
	
	if(navGroup == undefined) { 
		var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
			navGroupWindow = new navGroupWindow(window);
			navGroup = (navGroupWindow.getChildren())[0];
			navGroupWindow.result = null;
	}
	
	function getNavGroup()
	{
		if(navGroupWindow) return (navGroupWindow.getChildren())[0];
		else return navGroup; 
	}
	
	var warning = Ti.UI.createView({
	width: '100%',
	zIndex: 3,
	height: 70,
	backgroundColor: 'red',
	borderColor: 'red'
	});
	
	warning.add(Ti.UI.createLabel({ text: 'NOTE: This is for personal records, it does not schedule an actual appointment', textAlign: 'center', color: 'white' }));
	window.add(warning);
	
	if(appointment.id) { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.DONE }); } 
	else { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.SAVE }); }
	window.rightNavButton = save_btn;
	
	if(appointment.id) { var cancel_btn = Titanium.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.TRASH }); }
	else { var cancel_btn = Titanium.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.CANCEL }); }
	window.leftNavButton = cancel_btn;
	
	cancel_btn.addEventListener('click', function() {
		if(appointment.id == null) {
			if(navGroupWindow) navGroupWindow.close();
			else window.close();
			return;
		}
		var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to delete the record of this appointment?', 
								message: 'This cannot be undone', 
								buttonNames: ['Yes','No'], cancel: 1 });
								
	confirm.addEventListener('click', function(g) { 
   			//Clicked cancel, first check is for iphone, second for android
   			if (g.cancel === g.index || g.cancel === true) { return; }


  			 switch (g.index) {
     		 case 0:
     		 	Ti.App.fireEvent('eventSaved');
     		  	appointment.cloud_id = appointment.cloud_id?appointment.cloud_id:getAppointmentLocal(appointment.id)[0].cloud_id;
				deleteAppointmentLocal(appointment.id);			
				deleteObjectACS('appointments', appointment.cloud_id);
				navGroupWindow.result = -1;
      			if(navGroupWindow) navGroupWindow.close();
      			else navGroup.close(window);
      			break;

      		 case 1:       			
      		 default: break;
  			}
		});
		confirm.show();
	});
	
	
	save_btn.addEventListener('click', function() {
			if(appointment.id != null) {
				var all_saved=true;
				
					for(var i=0; i < table.data.length; i++) {
						//Check if the last row of the section is blue. In the case of the status section, this could also
						//be the second last row. 
						if(table.data[i].rows[table.data[i].rowCount-1].backgroundColor == 'blue' ||
							table.data[i].rows[table.data[i].rowCount-2].backgroundColor == 'blue') {
							all_saved=false;
							var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to close the window?', 
									message: 'You have not saved your changes', 
									buttonNames: ['Yes','No'], cancel: 1 });
										
							confirm.addEventListener('click', function(g) { 
						   			//Clicked cancel, first check is for iphone, second for android
						   			if (g.cancel === g.index || g.cancel === true) { return; }
							
							
						  			 switch (g.index) {
						     		 case 0:
						      			if(navGroupWindow) navGroupWindow.close();
      									else navGroup.close(window);
						      			return;
							
						      		 case 1:       			
							      		 default: return;
						  			}
								});
								confirm.show();						
						}
						
					}
					if(all_saved) { 
						if(navGroupWindow) navGroupWindow.close();
      					else navGroup.close(window); 
						return;
					} 
			}
			else { 
				if(!validateDateTime() || !validateSymptoms() || !validateDoctorDetails()) return;
				if(!beforeSaving()) return;
				saveStatusData();
				saveDetails();
				
				appointment.doctor.name = name.value;
				appointment.doctor.location = location.value;
				appointment.doctor.street = street.value;
				appointment.doctor.city = city.value;
				appointment.doctor.state = state.value;
				appointment.doctor.zip = zip.value;
				appointment.doctor.country = country.value;
				appointment.status = status.text;
				appointment.diagnosis = diagnosis.value;
				navGroupWindow.result = appointment;
				navGroupWindow.close();
			}
	});
	
	var table = Titanium.UI.createTableView({
	showVerticalScrollIndicator: false,
	rowHeight: 45,
	//separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	});
	
		
var sectionStatus = Ti.UI.createTableViewSection({ headerTitle: 'Status (tap to change)', });
sectionStatus.add(Ti.UI.createTableViewRow());
var status_title = Titanium.UI.createLabel({ text: 'Status', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var status = Ti.UI.createLabel({ left: '40%', width: 150, height: 60, text: appointment.status, font: { fontWeight: 'bold', fontSize: 20, }, });
sectionStatus.rows[0].add(status_title);
sectionStatus.rows[0].add(status);

var rowAdditionalNotes = Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white', hasChild: true, })
var additional_notes = Ti.UI.createLabel({ left: 15, width: '90%', text: appointment.additional_notes, font: { fontSize: 15, }, });
rowAdditionalNotes.add(additional_notes);
if(appointment.status === 'Completed') {
	sectionStatus.add(rowAdditionalNotes);
}

if(appointment.id) {
	sectionStatus.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionStatus.rows[sectionStatus.rowCount-1].add(Ti.UI.createLabel({ text: 'No changes made', textAlign: 'center', font: { fontSize: 15, }, }));
}

var rowNextActions = Ti.UI.createTableViewRow({ height: 80, hasChild: true, });
var nextActions_title = Titanium.UI.createLabel({ text: 'Recommended activities / prescribed treatments', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
rowNextActions.add(nextActions_title);
var activities = getActivitiesForAppointmentLocal(appointment.id);
var treatments = getTreatmentsForAppointmentLocal(appointment.id);
if(appointment.activities.length > 0 || appointment.treatments.length > 0) {
	if(appointment.status === 'Completed') { 
		sectionStatus.add(rowNextActions);
	}
}


var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Appointment Details(*=required)' });
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
sectionDetails.add(Ti.UI.createTableViewRow());
sectionDetails.add(Ti.UI.createTableViewRow());
sectionDetails.add(Ti.UI.createTableViewRow({ height: 135 }));
var dateTime = Titanium.UI.createLabel({ text: appointment.date+' '+appointment.time, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, bubbleParent: false,});
var duration_title = Titanium.UI.createLabel({ text: '*Duration', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
if(appointment.duration.hours == 0 && appointment.duration.minutes == 0) var string = 'No duration given';
else {
	var string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
	string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':'';
}
var duration = Titanium.UI.createLabel({ text: string, width: '50%', left: '50%', bubbleParent: false, });
var repeat_title = Titanium.UI.createLabel({ text: '*Repeat', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var repeat = Titanium.UI.createLabel({ text: appointment.repeat, width: '50%', left: '50%', bubbleParent: false, });
var alert_title = Titanium.UI.createLabel({ text: '*Alert', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var alert_text = Titanium.UI.createLabel({ text: appointment.alert, width: '50%', left: '50%', bubbleParent: false, });
if(appointment.symptoms.length == 0) var symptoms_message = "No symptom listed";
else if(appointment.symptoms.length == 1) var symptoms_message = appointment.symptoms.length+" symptom listed";
else var symptoms_message = appointment.symptoms.length+" symptoms listed";
var symptoms_title = Titanium.UI.createLabel({ text: symptoms_message, left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });

var name_title = Titanium.UI.createLabel({ text: '*Doctor', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var name = Ti.UI.createTextField({ hintText: 'eg: James Smith', value: appointment.doctor.name, left: '40%', width: '60%' });
var location_title = Titanium.UI.createLabel({ text: 'Location', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var location = Ti.UI.createTextField({ hintText: 'Clinic/Hospital name', value: appointment.doctor.location, left: '40%', width: '60%' });
var address_title = Titanium.UI.createLabel({ text: 'Address', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var street = Ti.UI.createTextField({ hintText: 'Street', value: appointment.doctor.street, borderColor: '#CCC', leftButtonPadding: 5, height: 45, width: '60%', left: '40%', top: 0 });
var city = Ti.UI.createTextField({ hintText: 'City', value: appointment.doctor.city, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '40%',  top: 45 });
var state = Ti.UI.createTextField({ hintText: 'State', value: appointment.doctor.state, borderColor: '#CCC', leftButtonPadding: 5, left: '80%', height: 45, width: '20%', top: 45 });
var zip = Ti.UI.createTextField({ hintText: 'ZIP', value: appointment.doctor.zip, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '20%', top: 90 });
var country = Ti.UI.createTextField({ hintText: 'Country', value: appointment.doctor.country, borderColor: '#CCC', leftButtonPadding: 5, left: '60%', height: 45, width: '40%', top: 90 });
sectionDetails.rows[0].add(dateTime);
sectionDetails.rows[1].add(duration_title);
sectionDetails.rows[1].add(duration);
sectionDetails.rows[2].add(repeat_title);
sectionDetails.rows[2].add(repeat);
sectionDetails.rows[3].add(alert_title);
sectionDetails.rows[3].add(alert_text);
sectionDetails.rows[4].add(symptoms_title);
sectionDetails.rows[5].add(name_title);
sectionDetails.rows[5].add(name);
sectionDetails.rows[6].add(location_title);
sectionDetails.rows[6].add(location);
sectionDetails.rows[7].add(address_title);
sectionDetails.rows[7].add(street);
sectionDetails.rows[7].add(city);
sectionDetails.rows[7].add(state);
sectionDetails.rows[7].add(zip);
sectionDetails.rows[7].add(country);
if(appointment.id) {
	sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'No changes made', textAlign: 'center', font: { fontSize: 15, }, }));
}



//Rules for what to display as the status
if(appointment.status === 'Completed' || appointment.status === 'Cancelled') {
	blurSection(sectionDetails);
}

//If the date is in the past, its been missed
if(appointment.id && !isValidDateTime(appointment.date+' '+appointment.time) && appointment.status === 'Scheduled') {
	status.text = 'Missed';
	sectionStatus.rows[0].backgroundColor = 'red';
}

//If its complete, show the additional sections for prescription, additional notes etc
//If its incomplete, just show status section
//If its being filled out for the first time, ie: appointment.id does not exist, do not show status
if(appointment.id) {
	table.data = [sectionStatus, sectionDetails];
}
else {
	table.data = sectionDetails;
}

window.add(table);


//returns true if a new appointment was successfully created
//returns false otherwise
function beforeSaving() 
{
	if(table.scrollable == false) return false;
	
	if(!Titanium.Network.online) {
		alert('Error:\n You are not connected to the internet. Cannot create new appointment');
		return false;
	}
	
	if(appointment.entry_id == null) {
		alert('logic for this not entered. must find an existing entry based on diagnosis, category, symptoms/goals');
		return false;
	}
	
	if(appointment.id == null) {
		var entry_id = '"'+appointment.entry_id+'"';
		var entry_cloud_id = getEntryLocal(appointment.entry_id)[0].cloud_id; 
		appointment.id = insertAppointmentLocal(entry_id, appointment.date, appointment.time);
		createObjectACS('appointments', { id: appointment.id, 
										entry_id:  entry_cloud_id, 
										diagnosis: null, //diagnosis.value,
										final_diagnosis: null, //final_diagnosis.value,
										status: status.text,
										date: appointment.date,
										time: appointment.time, 
										duration: appointment.duration,
										repeat: repeat.text,
										alert: alert_text.text,
										symptoms: (symptoms_field.value.replace(".",",")).split(','),
										additional_notes: additionalNotes_field.value,
										doctor: {
											name: name.value,
											location: location.value,
											street: street.value,
											city: city.value,
											state: state.value,
											zip: zip.value,
											country: country.value,
											}
									});
	}
	updateRecordTimesForEntryLocal(appointment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
	
	return true;
}

function activateSaveButton()
{
	if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == '#CCC') { 
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changes';
	}
}

function deactivateSaveButton()
{
	if(sectionDetails.rows[sectionDateTime.rowCount-1].backgroundColor == '#CCC') { 
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changes';
	}
}

//grey out an entire section to show it cant be modified
function blurSection(section)
{
	for(var i=0; i < section.rowCount; i++) {
		section.rows[i].backgroundColor = '#999999';
		var children = section.rows[i].children;
		for(var j=0; j < children.length; j++) {
			if(children[j].value != undefined) {
				children[j].setEnabled(false);
			}
			children[j].backgroundColor = '#999999';
		}
	}
}

//un-grey an entire section to show it can be modified
function unBlurSection(section)
{
	for(var i=0; i < section.rowCount; i++) {
		section.rows[i].backgroundColor = 'white';
		var children = section.rows[i].children;
		for(var j=0; j < children.length; j++) {
			children[j].backgroundColor = 'white';
			if(children[j].value != undefined) { 
				children[j].setEnabled(true);
			}
			if(i == section.rowCount-1) {
				section.rows[i].backgroundColor = '#CCC';
				children[j].backgroundColor = 'transparent';
			}
		}
	}
}

function isBlurred(e)
{
	return (e.row.backgroundColor == '#999999')?true:false; 
}

//returns true if user has allowed a status change, otherwise return false
function changeStatusAndUnblur()
{
	var confirm = Titanium.UI.createAlertDialog({ title: 'You cannot edit this field', 
							message: 'You must declare this appointment as scheduled in order to edit this field.'+
										' Would you like to change the status to scheduled?', 
							buttonNames: ['Yes','No'], cancel: 1 });
										
					confirm.addEventListener('click', function(g) { 
				  			//Clicked cancel, first check is for iphone, second for android
				   		if (g.cancel === g.index || g.cancel === true) { return; }
							
							
				  		 switch (g.index) {
				     		 case 0:
				     		 	if(status.text === 'Completed') {
				     		 		table.deleteRow(rowAdditionalNotes);
				     		 		if(appointment.activities.length > 0 || appointment.treatments.length > 0) {
				     		 			table.deleteRow(rowNextActions);
				     		 		}				     		 		
				     		 	}
				      			status.text = 'Scheduled';
				      			saveStatus(sectionStatus.rowCount-1);
				      			unBlurSection(sectionDetails);
				      			return true;
							
				      		 case 1:       			
				      		 default: return false;
			  			}
					});
					confirm.show();
}

function saveStatus(row_index)
{
	updateAppointmentLocal(appointment.id, 'status', status.text);
	
	if(row_index == undefined) row_index = sectionStatus.rowCount-1;
	if(sectionStatus.rows[row_index].backgroundColor == 'blue')	{
		sectionStatus.rows[row_index].backgroundColor = '#CCC';
		sectionStatus.rows[row_index].children[0].text = 'Changes Saved!';
	}
}

function saveAdditionalNotes(row_index)
{	
	updateAppointmentLocal(appointment.id, 'additional_notes', additional_notes.text);
	sectionStatus.rows[row_index].children[0].text = 'Changes Saved';
	
	if(row_index == undefined) row_index - sectionStatus.rowCount-1;
	if(!sectionStatus.rows[row_index+1] && status.text === 'Completed') {
		table.insertRowAfter(row_index, rowNextActions);
	}
}

function saveStatusData(row_index)
{
	if(!beforeSaving()) return;
	saveStatus(row_index);
	saveAdditionalNotes(row_index);
	
	if(sectionStatus.rows[row_index].backgroundColor == 'blue') {
		sectionStatus.rows[row_index].backgroundColor = '#CCC';
	}
}

sectionStatus.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		saveStatusData(e.index);
		return;
	}
});

status.addEventListener('click', function(e) {
	var data = [];
	data[0] = 'Scheduled';
	data[1] = 'Completed';
	data[2] = 'Cancelled';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,status.text); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: sectionStatus.rows[0], });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			//The diagnosis section must only show if the appointment has been completed
			if(modalPicker.result === 'Completed' && status.text != 'Completed') {
				table.insertRowAfter(e.index, rowAdditionalNotes);
				var activities = getActivitiesForAppointmentLocal(appointment.id);
				var treatments = getTreatmentsForAppointmentLocal(appointment.id);
				if(appointment.activities.length > 0 || appointment.treatments.length > 0) {
					table.insertRowAfter(e.index+2, rowNextActions);
				}
			}
			if(modalPicker.result != 'Completed') {
				table.deleteRow(rowNextActions);
				table.deleteRow(rowAdditionalNotes);
			}
			if(modalPicker.result == 'Completed' || modalPicker.result == 'Cancelled') {
				blurSection(sectionDetails);
			}
			if(modalPicker.result == 'Scheduled') {
				unBlurSection(sectionDetails);
			} 
			status.text = modalPicker.result;
			sectionStatus.rows[0].backgroundColor = 'white';
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') { 
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
			}
			if(sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor == '#CCC') { 
				sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-2].children[0].text = 'Save Changes';
			}
		}
		window.setTouchEnabled(true);
		if(window.leftNavButton != null) { 
			window.leftNavButton.setTouchEnabled(true);
		}
		window.rightNavButton.setTouchEnabled(true); 
		table.scrollable = true;
	};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

rowAdditionalNotes.addEventListener('click', function() {
	var additional_notes_page = require('ui/common/helpers/textarea');
	if(additional_notes.text === "No additional notes") {
		var additional_notes_text = '';
	}
	else {
		var additional_notes_text = additional_notes.text;
	}
	additional_notes_page = new additional_notes_page('Additional Notes', "Make any additional notes regarding the outcome of this appointment, such as any diagnosis that was given", 
									additional_notes_text);
									
	(getNavGroup()).open(additional_notes_page);
													
	additional_notes_page.addEventListener('close', function() {
		if(additional_notes.text != additional_notes_page.result) { 
			if(!additional_notes_page.result) {
				additional_notes.text = "No additional notes";
			}
			else {
				additional_notes.text = additional_notes_page.result;
			}
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') {
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
			}
		}
	});	
});

rowNextActions.addEventListener('click', function() {
	if(sectionStatus.rows[sectionStatus.rowCount-2].backgroundColor == 'blue') {
		saveStatus(2);
		saveAdditionalNotes(2);
	}
	var actions_page = require('ui/common/views/actions');
		var actions = {
			appointment_id: appointment.id,
			entry_id: appointment.entry_id,
		}
		actions_page = new actions_page(actions, navGroup);
	
	(getNavGroup()).open(actions_page); //open the prescription window in the navgroup
	
	actions_page.addEventListener('close', function() { 
		appointment.activities = getActivitiesForAppointmentLocal(appointment.id);
		appointment.treatments = getTreatmentsForAppointmentLocal(appointment.id);
	});
});

function validateDateTime()
{
	if((new Date(dateTime.text) < new Date()) && status.text == 'Scheduled') { 
		alert('You may have entered a date that has already passed. Kindly recheck'); 
		return false;
	}
	if(appointment.duration.hours == 0 && appointment.duration.minutes < 5) {
		alert('You have not specified a duration. Kindly recheck');
		return false;
	}
	return true;
}

function saveDateTime()
{
	if(!validateDateTime()) return;
	if(!beforeSaving()) return;
		
	updateAppointmentLocal(appointment.id, 'date', appointment.date);
	updateAppointmentLocal(appointment.id, 'time', appointment.time);
	updateAppointmentLocal(appointment.id, 'duration_hours', appointment.duration.hours);
	updateAppointmentLocal(appointment.id, 'duration_minutes', appointment.duration.minutes);
	updateAppointmentLocal(appointment.id, 'repeat', repeat.text);
	updateAppointmentLocal(appointment.id, 'alert', alert_text.text);
}
	
dateTime.addEventListener('click', function(e) {	
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}

modalPicker = require('ui/common/helpers/modalPicker');
var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,null,dateTime.text); 

if(window.leftNavButton != null) { 
	window.leftNavButton.setTouchEnabled(false);
}
window.rightNavButton.setTouchEnabled(false); 
window.setTouchEnabled(false);
table.scrollable = false;

if(Titanium.Platform.osname == 'iphone') modalPicker.open();
if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: appointment });


var picker_closed = function() {
	if(modalPicker.result) { 
		var newDate = timeFormatted(modalPicker.result);
		appointment.date = newDate.date;
		appointment.time = newDate.time;
		dateTime.text = newDate.date+' '+newDate.time;
		activateSaveButton();
	}
	window.setTouchEnabled(true);
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(true);
	}
	window.rightNavButton.setTouchEnabled(true); 
	table.scrollable = true;
	};
	
	if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
	if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

duration.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER,null,hoursMinutesToMilliseconds(appointment.duration.hours, appointment.duration.minutes)); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: duration, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			var milliseconds = modalPicker.result
			appointment.duration.minutes = millisecondsToHoursMinutesSeconds(milliseconds).minutes;					
			appointment.duration.hours = millisecondsToHoursMinutesSeconds(milliseconds).hours;
			var string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
			string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':'';
			if(string.length == 0) { string = 'No duration specified'; }
			duration.text = string;
			activateSaveButton();
		}
		window.setTouchEnabled(true);
		if(window.leftNavButton != null) { 
			window.leftNavButton.setTouchEnabled(true);
		}
		window.rightNavButton.setTouchEnabled(true); 
		table.scrollable = true;
		};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

repeat.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	
	var data = [];
	data[0] = 'once only';
	data[1] = 'every day';
	data[2] = 'every week';
	data[3] = 'every month';
	data[4] = 'every year';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,repeat.text); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: repeat, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			repeat.text = modalPicker.result;
			activateSaveButton();
		}
		window.setTouchEnabled(true);
		if(window.leftNavButton != null) { 
			window.leftNavButton.setTouchEnabled(true);
		}
		window.rightNavButton.setTouchEnabled(true); 
		table.scrollable = true;
		};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

alert_text.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	
	var data = [];
	data[0] = '15 minutes before';
	data[1] = '30 minutes before';
	data[2] = '1 hour before';
	data[3] = '2 hours before';
	data[4] = '1 day before';
	data[5] = 'no alert';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,alert_text.text); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: alert_text, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			alert_text.text = modalPicker.result;
			activateSaveButton();
		}
		window.setTouchEnabled(true);
		if(window.leftNavButton != null) { 
			window.leftNavButton.setTouchEnabled(true);
		}
		window.rightNavButton.setTouchEnabled(true); 
		table.scrollable = true;
		};
		
		if(Titanium.Platform.osname == 'iphone') modalPicker.addEventListener('close', picker_closed);
		if(Titanium.Platform.osname == 'ipad') modalPicker.addEventListener('hide', picker_closed);
});

function validateSymptoms()
{
	if(appointment.symptoms.length < 1) {
		alert('You must list at least one symptom');
		return false;
	}
	return true;
}

function saveSymptoms()
{
	if(!validateSymptoms()) return;
	if(!beforeSaving()) return;	
		
	deleteSymptomsForAppointmentLocal(appointment.id);
	for(var i=0; i < appointment.symptoms.length; i++) {
		appointment.symptoms[i] = removeWhiteSpace(appointment.symptoms[i]);
		appointment.symptoms[i] = insertSymptomForAppointmentLocal(appointment.id, appointment.symptoms[i]);
	}
}

symptoms_title.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	
	var symptoms_page = require('ui/common/helpers/items');
	symptoms_page = new symptoms_page(appointment.symptoms, 'Symptoms');
	(getNavGroup()).open(symptoms_page);
	
	symptoms_page.addEventListener('close', function() {
		if(areArraysSame(appointment.symptoms, symptoms_page.result)) return; 
		
		appointment.symptoms = symptoms_page.result;
		if(appointment.symptoms.length == 0) symptoms_title.text = "No symptoms listed"; 
		else if(appointment.symptoms.length == 1) symptoms_title.text = appointment.symptoms.length+" symptom listed";
		else if(appointment.symptoms.length > 1) symptoms_title.text = appointment.symptoms.length+ " symptoms listed";
		activateSaveButton();
	});
});

var details_button = function() {
	activateSaveButton();
}


name.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

location.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

street.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

city.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

state.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

zip.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});

country.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) name.blur();
	}
});


name.addEventListener('blur', details_button);
location.addEventListener('blur', details_button);
street.addEventListener('blur', details_button);
city.addEventListener('blur', details_button);
state.addEventListener('blur', details_button);
zip.addEventListener('blur', details_button);
country.addEventListener('blur', details_button);

function validateDoctorDetails()
{
	var onlyLetters = containsOnlyLetters(name.value);
	if(name.value.length > 1 && onlyLetters) { return true; }
		else { 
			if(name.value.length < 1) {
				alert("You have not entered a doctor's name. Kindly recheck")
			}
			else if(!onlyLetters) { 
				alert('Doctors name must be longer than one character and contain only letters');
			} 
			return false; 
		}
	return true;
}

function saveDoctorDetails()
{
	if(0 == updateDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value)) { 
		insertDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value); 
	}
}

function saveDetails() 
{	
	if(!validateDoctorDetails() || !validateDateTime() || !validateSymptoms()) return;
	if(!beforeSaving()) return;
		
	saveDateTime();
	saveSymptoms();
	saveDoctorDetails();
	
	Ti.App.fireEvent('eventSaved');
	deactivateSaveButton();
}

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveDetails();
});


if(navGroupWindow) return navGroupWindow;
else return window;


}

module.exports = appointment;
