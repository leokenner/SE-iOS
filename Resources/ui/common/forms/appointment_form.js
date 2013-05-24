


function appointment(input)
{
	Ti.include('ui/common/helpers/dateTime.js');
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
		repeat: input.repeat?input.repeat:'Once only',
		alert: input.alert?input.alert:'30 mins before',
		categories: input.categories?input.categories:[],
		symptoms: input.symptoms?input.symptoms:[],
		additional_notes: input.additional_notes?input.additional_notes:null,
		doctor: input.doctor?input.doctor:{
								name: null,
								location: null,
								street: null,
								city: null,
								state: null,
								zip: null,
								country: null,
								},
		activities: input.activities?input.activities:[],
		treatments: input.treatments?input.treatments:[],	
	} 
	
	var categories_string='';
	for(var i=0;i < appointment.categories.length; i++) {
		categories_string += appointment.categories[i];
		if(i != appointment.categories.length -1) categories_string += ', ';
	}
	
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
	
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
		navGroupWindow = new navGroupWindow(window);
		navGroupWindow.result = null;
	
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
			navGroupWindow.close();
			return;
		}
		var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure?', 
								message: 'This cannot be undone', 
								buttonNames: ['Yes','No'], cancel: 1 });
								
	confirm.addEventListener('click', function(g) { 
   			//Clicked cancel, first check is for iphone, second for android
   			if (g.cancel === g.index || g.cancel === true) { return; }


  			 switch (g.index) {
     		 case 0:
     		  	appointment.cloud_id = appointment.cloud_id?appointment.cloud_id:getAppointmentLocal(appointment.id)[0].cloud_id;
				deleteAppointmentLocal(appointment.id);			
				deleteObjectACS('appointments', appointment.cloud_id);
				navGroupWindow.result = -1;
      			navGroupWindow.close();
      			break;

      		 case 1:       			
      		 default: break;
  			}
		});
		confirm.show();
	});
	
	function removeWhiteSpace(input)
	{
		return input.replace(/^\s\s*/, ''); //Remove preceeding white space
	}
	
	save_btn.addEventListener('click', function() {
	/*	if(table.scrollable == false) { return; }

		var name_test=false, dateTime_test=false, categories_test=false, symptoms_test=false;


		if(!isValidDateTime(sectionDateTime.rows[0].children[0].text) && status.text != 'Scheduled') { 
			alert('You may have entered a date that has already passed. Kindly recheck'); 
		}
		else { dateTime_test = true; }
		//Remove the whitespace then test to make sure there are only letters
		var onlyLetters = /^[a-zA-Z]/.test(name.value.replace(/\s/g, ''));
		if(name.value != null && name.value.length > 1 && onlyLetters) { name_test = true; }
		else { alert('Doctors name must be longer than one character and contain only letters'); }
		if(categories_field.value == null || categories_field.value == '') {
			alert('You must list at least one category');
		}
		else { categories_test=true; }
		if(symptoms_field.value == null || symptoms_field.value == '') {
			alert('You must list at least one symptom');
		}
		else { symptoms_test=true; }
		
		if(dateTime_test && name_test && categories_test && symptoms_test)
		{

			
			if(final_diagnosis.value.length > 0) {  //If the final diagnosis has been entered, we want to replace the earlier diagnosis with this one
				final_diagnosis.value = final_diagnosis.value.replace("'", "''");
				diagnosis.value = final_diagnosis.value;
			}
			
			if(appointment.id == null) {
				if(!Titanium.Network.online) {
					alert('Error:\n You are not connected to the internet. Cannot create new appointment');
					return;
				}
				
				var entry_id = '"'+appointment.entry_id+'"';
				appointment.id = insertAppointmentLocal(entry_id,appointment.date,appointment.time,diagnosis.value);
				appointment.doctor.id = insertDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value);
			
				createObjectACS('appointments', { id: appointment.id, entry_id: appointment.entry_id, 
													date: appointment.date, time: appointment.time, diagnosis: diagnosis.value, });
			}
			else {
				updateAppointmentLocal(appointment.id,appointment.date,appointment.time,diagnosis.value);
				updateDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value);
			}
			
			if(additionalNotes_field.value.length > 0) {
				updateAdditionalNotesForAppointmentLocal(appointment.id, additionalNotes_field.value);
			}
			
			deleteCategoriesForAppointmentLocal(appointment.id);
			appointment.categories.splice(0, appointment.categories.length);
			
			if(categories_field.value != null) {
				if(categories_field.value.length > 1) {
					var final_categories = categories_field.value.split(',');
					for(var i=0;i < final_categories.length;i++) {
						if(final_categories[i].length < 2) continue;
						final_categories[i] = removeWhiteSpace(final_categories[i])
						insertCategoryForAppointmentLocal(appointment.id,final_categories[i]);
						appointment.categories.push(final_categories[i]);
					}
				}
			}
			
			deleteSymptomsForAppointmentLocal(appointment.id);
			appointment.symptoms.splice(0, appointment.symptoms.length);
			
			if(symptoms_field.value != null) {
				if(symptoms_field.value.length > 1) {
					var final_symptoms = symptoms_field.value.split(',');
					for(var i=0;i < final_symptoms.length;i++) {
						if(final_symptoms[i].length < 2) continue;
						final_symptoms[i] = removeWhiteSpace(final_symptoms[i]);
						insertSymptomForAppointmentLocal(appointment.id,final_symptoms[i]);
						appointment.symptoms.push(final_symptoms[i]);
					}
				}
			}
			
			updateAppointmentStatus(appointment.id,status.text); */
			if(appointment.id != null) { 
				navGroupWindow.close(); 
				return; 
			}
			if(!validateDateTime() || !validateCategories() || !validateSymptoms() || !validateDetails()) return;
			if(!beforeSaving()) return;
			saveStatus();
			saveFinalDiagnosis();
			saveAdditionalNotes();
			saveDateTime();
			saveCategories();
			saveSymptoms();
			saveDetails();
			updateRecordTimesForEntryLocal(appointment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
			
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
		//}
	});
	
	var table = Titanium.UI.createTableView({
	showVerticalScrollIndicator: false,
	rowHeight: 45,
	//separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	});
	
		
var sectionStatus = Ti.UI.createTableViewSection({ headerTitle: 'Status (tap to change)', });
sectionStatus.add(Ti.UI.createTableViewRow());
sectionStatus.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
var status_title = Titanium.UI.createLabel({ text: 'Status', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var status = Ti.UI.createLabel({ left: '40%', width: 150, text: appointment.status, font: { fontWeight: 'bold', fontSize: 20, }, });
sectionStatus.rows[0].add(status_title);
sectionStatus.rows[0].add(status);
sectionStatus.rows[1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));

var sectionDiagnosis = Ti.UI.createTableViewSection({ headerTitle: 'Diagnosis' });
sectionDiagnosis.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDiagnosis.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
var final_diagnosis_title = Titanium.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var final_diagnosis = Titanium.UI.createTextField({ hintText: 'Enter here', value: appointment.final_diagnosis, width: '50%', left: '50%' });
sectionDiagnosis.rows[0].add(final_diagnosis_title);
sectionDiagnosis.rows[0].add(final_diagnosis);
sectionDiagnosis.rows[1].add(Ti.UI.createLabel({ text: 'Changes Saved!', font: { fontSize: 15, }, }));

var sectionPrescription = Ti.UI.createTableViewSection();
sectionPrescription.add(Ti.UI.createTableViewRow({ title: 'Prescribed treatments', hasChild: true, }));

var sectionAdditionalNotes = Ti.UI.createTableViewSection({ headerTitle: 'Additional Notes', });
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ height: 135, selectedBackgroundColor: 'white', }));
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
sectionAdditionalNotes.rows[0].add(Ti.UI.createLabel({ 
									left: 15,
									top: 5,
									text: 'This is where you make any additional notes about things you might have discussed with the doctor.', }));
var additionalNotes_field = Titanium.UI.createTextArea({ hintText: 'Additional notes', value: appointment.additional_notes, width: '100%', top: 5, font: { fontSize: 17 }, height: 115, borderRadius: 10 });
sectionAdditionalNotes.rows[1].add(additionalNotes_field);
sectionAdditionalNotes.rows[2].add(Ti.UI.createLabel({ text: 'Changes Saved!', font: { fontSize: 15, }, }));

var sectionDateTime = Ti.UI.createTableViewSection({ headerTitle: 'Date and Time(tap to change)' });
sectionDateTime.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDateTime.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDateTime.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionDateTime.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
var dateTime = Titanium.UI.createLabel({ text: appointment.date+' '+appointment.time, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, bubbleParent: false,});
sectionDateTime.rows[0].add(dateTime);
sectionDateTime.rows[1].add(Titanium.UI.createLabel({ text: '*Duration', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
if(appointment.duration.hours == 0 && appointment.duration.minutes == 0) var string = 'No duration given';
else {
	var string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
	string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':'';
}
var duration = Titanium.UI.createLabel({ text: string, width: '50%', left: '50%', bubbleParent: false, });
sectionDateTime.rows[1].add(duration);
sectionDateTime.rows[2].add(Titanium.UI.createLabel({ text: '*Repeat', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
var repeat = Titanium.UI.createLabel({ text: appointment.repeat, width: '50%', left: '50%', bubbleParent: false, });
sectionDateTime.rows[2].add(repeat);
sectionDateTime.rows[3].add(Titanium.UI.createLabel({ text: '*Alert', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, }));
var alert_text = Titanium.UI.createLabel({ text: appointment.alert, width: '50%', left: '50%', bubbleParent: false, });
sectionDateTime.rows[3].add(alert_text);

if(appointment.id) {
	sectionDateTime.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionDateTime.rows[sectionDateTime.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
}

var sectionCategories = Ti.UI.createTableViewSection({ headerTitle: '*Categories(list using commas)' });
sectionCategories.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionCategories.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
sectionCategories.rows[0].add(Ti.UI.createLabel({
								left: 5,
								width: '90%',  
								text: "Please list the categories that you feel this appointment applies to. For example, "+
										"if it is about a health issue, please enter heath. If it is a behavioral issue, "+
										"please enter behavior. If you feel it is both a health and behavior issue, enter heath, behavior"+
										" Minimum one category required. ", }));	
var categories_field = Titanium.UI.createTextArea({ hintText: 'Seperate each category by comma', value: categories_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
sectionCategories.rows[1].add(categories_field);

if (appointment.id) {
	sectionCategories.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionCategories.rows[sectionCategories.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', font: { fontSize: 15, }, }));
}

var sectionSymptoms = Ti.UI.createTableViewSection({ headerTitle: '*Diagnosis/Symptoms' });
sectionSymptoms.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionSymptoms.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionSymptoms.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
sectionSymptoms.rows[0].add(Ti.UI.createLabel({
								left: 5,
								width: '90%',  
								text: "If you know what the patient has been diagnosed with, please mention it here.", }));
var diagnosis_title = Titanium.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var diagnosis = Titanium.UI.createTextField({ hintText: 'Enter here', value: appointment.diagnosis, width: '50%', left: '50%' });
sectionSymptoms.rows[1].add(diagnosis_title);
sectionSymptoms.rows[1].add(diagnosis);
sectionSymptoms.rows[2].add(Ti.UI.createLabel({
								left: 5,
								width: '90%',  
								text: "Please list the symptoms(separated by commas) that the patient is suffering from. For example, "+
										"you can list depression, panic attacks. Minimum one symptom required.", }));

var symptoms_field = Titanium.UI.createTextArea({ hintText: 'Seperate each symptom by comma', value: symptoms_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
sectionSymptoms.rows[3].add(symptoms_field);

if(appointment.id) {
	sectionSymptoms.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionSymptoms.rows[sectionSymptoms.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
}

var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Doctor Details(*=required)' });
sectionDetails.add(Ti.UI.createTableViewRow());
sectionDetails.add(Ti.UI.createTableViewRow());
sectionDetails.add(Ti.UI.createTableViewRow({ height: 135 }));

var name_title = Titanium.UI.createLabel({ text: '*Name', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var name = Ti.UI.createTextField({ hintText: 'eg: James Smith', value: appointment.doctor.name, left: '40%', width: '60%' });
var location_title = Titanium.UI.createLabel({ text: 'Location', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var location = Ti.UI.createTextField({ hintText: 'Clinic/Hospital name', value: appointment.doctor.location, left: '40%', width: '60%' });
var address_title = Titanium.UI.createLabel({ text: 'Address', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var street = Ti.UI.createTextField({ hintText: 'Street', value: appointment.doctor.street, borderColor: '#CCC', leftButtonPadding: 5, height: 45, width: '60%', left: '40%', top: 0 });
var city = Ti.UI.createTextField({ hintText: 'City', value: appointment.doctor.city, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '40%',  top: 45 });
var state = Ti.UI.createTextField({ hintText: 'State', value: appointment.doctor.state, borderColor: '#CCC', leftButtonPadding: 5, left: '80%', height: 45, width: '20%', top: 45 });
var zip = Ti.UI.createTextField({ hintText: 'ZIP', value: appointment.doctor.zip, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '20%', top: 90 });
var country = Ti.UI.createTextField({ hintText: 'Country', value: appointment.doctor.country, borderColor: '#CCC', leftButtonPadding: 5, left: '60%', height: 45, width: '40%', top: 90 });
sectionDetails.rows[0].add(name_title);
sectionDetails.rows[0].add(name);
sectionDetails.rows[1].add(location_title);
sectionDetails.rows[1].add(location);
sectionDetails.rows[2].add(address_title);
sectionDetails.rows[2].add(street);
sectionDetails.rows[2].add(city);
sectionDetails.rows[2].add(state);
sectionDetails.rows[2].add(zip);
sectionDetails.rows[2].add(country);

if(appointment.id) {
	sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
}






//Rules for what to display as the status

//If the date is in the past, its been missed
if(appointment.id && !isValidDateTime(appointment.date+' '+appointment.time) && appointment.status === 'Scheduled') {
	status.text = 'Missed';
	sectionStatus.rows[0].backgroundColor = 'red';
}

//If its complete, show the additional sections for prescription, additional notes etc
//If its incomplete, just show status section
//If its being filled out for the first time, ie: appointment.id does not exist, do not show status
if(appointment.id) {
	if(appointment.status == 'Completed') {
		table.data = [sectionStatus, sectionDiagnosis, sectionPrescription, sectionAdditionalNotes, sectionDateTime, sectionCategories, sectionSymptoms, sectionDetails];	
	}
	else {
		table.data = [sectionStatus, sectionDateTime, sectionCategories, sectionSymptoms, sectionDetails];	
	}
}
else {
	table.data = [sectionDateTime, sectionCategories, sectionSymptoms, sectionDetails];
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
		appointment.id = insertAppointmentLocal(entry_id, appointment.date, appointment.time);
		createObjectACS('appointments', { id: appointment.id, entry_id: appointment.entry_id, });
		return true;
	}
	
	return true;
}

function saveStatus()
{
	if(!beforeSaving()) return;
	updateAppointmentLocal(appointment.id, 'status', status.text);
	if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == 'blue')	sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = '#CCC';
	if(status.text != 'Scheduled') sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved!';
	else { sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved-Pleased change date and time below'; }
}


sectionStatus.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		saveStatus;
		return;
	}
	
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
				table.data = [sectionStatus, sectionDiagnosis, sectionPrescription, sectionAdditionalNotes, sectionDateTime, sectionCategories, sectionSymptoms, sectionDetails];
			}
			if(modalPicker.result != 'Completed') {
				table.data = [sectionStatus, sectionDateTime, sectionCategories, sectionSymptoms, sectionDetails];
			} 
			status.text = modalPicker.result;
			sectionStatus.rows[0].backgroundColor = 'white';
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') { 
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
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


final_diagnosis.addEventListener('blur', function() {
	if(final_diagnosis.value.length > 0 && sectionDiagnosis.rows[sectionDiagnosis.rowCount].backgroundColor == '#CCC') {
		sectionDiagnosis.rows[sectionDiagnosis.rowCount-1].backgroundColor = 'blue';
		sectionDiagnosis.rows[sectionDiagnosis.rowCount-1].children[0].text = 'Save Changes';	
	}
});

function saveFinalDiagnosis()
{
	if(!beforeSaving()) return;
	updateAppointmentLocal(appointment.id,'final_diagnosis',final_diagnosis.value);
	if(sectionDiagnosis.rows[sectionDiagnosis.rowCount-1].backgroundColor == 'blue') { 	
		sectionDiagnosis.rows[1].backgroundColor = '#CCC';
		sectionDiagnosis.rows[1].children[0].text = 'Changes Saved!';
	}
}

sectionDiagnosis.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveFinalDiagnosis();
});


sectionPrescription.addEventListener('click', function() {
	var prescription = require('ui/common/forms/prescription_form');
		var actions = {
			appointment_id: appointment.id,
			entry_id: appointment.entry_id,
			doctor_name: name.value,
			diagnosis: diagnosis.value,
			activities: appointment.activities,
			treatments: appointment.treatments,
		}
		prescription = new prescription(actions);
	
	var children = navGroupWindow.getChildren();
	children[0].open(prescription); //open the prescription window in the navgroup
	
	prescription.addEventListener('close', function() {
		if(prescription.result != null) { 
			appointment.activities = prescription.result.activities;
			appointment.treatments = prescription.result.treatments;
		}
	});
});

additionalNotes_field.addEventListener('blur', function() {
	if(additionalNotes_field.value.length > 0 && sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor == '#CCC') {
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor = 'blue';
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].children[0].text = 'Save Changes';
	}
});

function saveAdditionalNotes()
{
	if(!beforeSaving()) return;
	
	updateAppointmentLocal(appointment.id, 'additional_notes', additionalNotes_field.value);

	if(sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor == 'blue') {
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor = '#CCC';
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].children[0].text = 'Changes Saved';
	}
}

sectionAdditionalNotes.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveAdditionalNotes();
});

function validateDateTime()
{
	if(!isValidDateTime(dateTime.text) && status.text == 'Scheduled') { 
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
	if(!validateDateTime() || !beforeSaving()) return;
		
	updateAppointmentLocal(appointment.id, 'date', appointment.date);
	updateAppointmentLocal(appointment.id, 'time', appointment.time);
	updateAppointmentLocal(appointment.id, 'duration_hours', appointment.duration.hours);
	updateAppointmentLocal(appointment.id, 'duration_minutes', appointment.duration.minutes);
	updateAppointmentLocal(appointment.id, 'repeat', repeat.text);
	updateAppointmentLocal(appointment.id, 'alert', alert_text.text);
	if(sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor == 'blue') { 
		sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor = '#CCC';
		sectionDateTime.rows[sectionDateTime.rowCount-1].children[0].text = 'Changes Saved!';
	}
}

sectionDateTime.addEventListener('click', function(e) {
if(e.row.backgroundColor == 'blue') {
	saveDateTime();
	return;
}
});
	
dateTime.addEventListener('click', function() {	
if(status.text != 'Scheduled') {
	alert('Please change the status of the appointment to scheduled if you would like to change to date/time');
	return;
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
		if(sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor == '#CCC') { 
			sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor = 'blue';
			sectionDateTime.rows[sectionDateTime.rowCount-1].children[0].text = 'Save Changes';
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

duration.addEventListener('click', function() {
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
			appointment.duration.minutes = millisecondsToHoursMinutes(milliseconds).minutes;					
			appointment.duration.hours = millisecondsToHoursMinutes(milliseconds).hours;
			var string = (appointment.duration.hours > 0)?appointment.duration.hours+' hours ':'';
			string += (appointment.duration.minutes > 1)?appointment.duration.minutes+' minutes':'';
			if(string.length == 0) { string = 'No duration specified'; }
			duration.text = string;
			if(sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor == '#CCC') { 
				sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor = 'blue';
				sectionDateTime.rows[sectionDateTime.rowCount-1].children[0].text = 'Save Changes';
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

repeat.addEventListener('click', function() {
	var data = [];
	data[0] = 'Once only';
	data[1] = 'Every Day';
	data[2] = 'Every Week';
	data[3] = 'Every 2 Weeks';
	data[4] = 'Every Month';
	data[5] = 'Every Year';
	
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
			if(sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor == '#CCC') { 
				sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor = 'blue';
				sectionDateTime.rows[sectionDateTime.rowCount-1].children[0].text = 'Save Changes';
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

alert_text.addEventListener('click', function() {
	var data = [];
	data[0] = '15 Minutes Before';
	data[1] = '30 Minutes Before';
	data[2] = '1 Hour Before';
	data[3] = '2 Hours Before';
	data[4] = '1 Day Before';
	data[5] = 'No alert';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,alert.text); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: alert, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			alert_text.text = modalPicker.result;
			if(sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor == '#CCC') { 
				sectionDateTime.rows[sectionDateTime.rowCount-1].backgroundColor = 'blue';
				sectionDateTime.rows[sectionDateTime.rowCount-1].children[0].text = 'Save Changes';
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

categories_field.addEventListener('blur', function() {
	if(categories_field.value.length > 0 && sectionCategories.rows[sectionCategories.rowCount-1].backgroundColor == '#CCC') {
		sectionCategories.rows[sectionCategories.rowCount-1].backgroundColor = 'blue';
		sectionCategories.rows[sectionCategories.rowCount-1].children[0].text = 'Save Changes';
	}
});

function validateCategories()
{
	if(categories_field.value == null || categories_field.value == '') {
		alert('You must list at least one category');
		return false;
	}
	return true;
}

function saveCategories() 
{
	if(!validateCategories() || !beforeSaving()) return;	
		
		deleteCategoriesForAppointmentLocal(appointment.id);
			appointment.categories.splice(0, appointment.categories.length);
			
			if(categories_field.value != null) {
				if(categories_field.value.length > 1) {
					var final_categories = categories_field.value.split(',');
					for(var i=0;i < final_categories.length;i++) {
						if(final_categories[i].length < 2) continue;
						final_categories[i] = removeWhiteSpace(final_categories[i]);
						insertCategoryForAppointmentLocal(appointment.id,final_categories[i]);
						appointment.categories.push(final_categories[i]);
					}
				}
			}
		
		if(sectionCategories.rows[sectionCategories.rowCount-1].backgroundColor == 'blue') { 
			sectionCategories.rows[sectionCategories.rowCount-1].backgroundColor = '#CCC';
			sectionCategories.rows[sectionCategories.rowCount-1].children[0].text = 'Changes Saved!';
		}
}

sectionCategories.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveCategories();
});

diagnosis.addEventListener('blur', function() {
	if(diagnosis.value.length > 0 && sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor == '#CCC') {
		sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor = 'blue';
		sectionSymptoms.rows[sectionSymptoms.rowCount-1].children[0].text = 'Save Changes';
	}
})

symptoms_field.addEventListener('blur', function() {
	if(symptoms_field.value.length > 0 && sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor == '#CCC') {
		sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor = 'blue';
		sectionSymptoms.rows[sectionSymptoms.rowCount-1].children[0].text = 'Save Changes';
	}
});

function validateSymptoms()
{
	if(symptoms_field.value == null || symptoms_field.value == '') {
		alert('You must list at least one symptom');
		return false;
	}
	return true;
}

function saveSymptoms()
{
	if(!validateSymptoms() || !beforeSaving()) return;
		
		
		//As diagnosis belongs in the symptoms section, save it too
		updateAppointmentLocal(appointment.id, 'diagnosis', diagnosis.value);
		
		deleteSymptomsForAppointmentLocal(appointment.id);
			appointment.symptoms.splice(0, appointment.symptoms.length);
			
			if(symptoms_field.value != null) {
				if(symptoms_field.value.length > 1) {
					var final_symptoms = symptoms_field.value.split(',');
					for(var i=0;i < final_symptoms.length;i++) {
						if(final_symptoms[i].length < 2) continue;
						final_symptoms[i] = removeWhiteSpace(final_symptoms[i]);
						insertSymptomForAppointmentLocal(appointment.id,final_symptoms[i]);
						appointment.symptoms.push(final_symptoms[i]);
					}
				}
			}
		
		if(sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor == 'blue') { 
			sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor = '#CCC';
			sectionSymptoms.rows[sectionSymptoms.rowCount-1].children[0].text = 'Changes Saved!';
		}
}

sectionSymptoms.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveSymptoms();
});


var details_button = function() {
	if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == '#CCC') { 
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changed';
	}
}

name.addEventListener('blur', details_button);
location.addEventListener('blur', details_button);
street.addEventListener('blur', details_button);
city.addEventListener('blur', details_button);
state.addEventListener('blur', details_button);
zip.addEventListener('blur', details_button);
country.addEventListener('blur', details_button);

function validateDetails()
{
	var onlyLetters = /^[a-zA-Z]/.test(name.value.replace(/\s/g, ''));
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

function saveDetails() 
{	
	if(!validateDetails() || !beforeSaving()) return;
		
		if(0 == updateDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value)) { 
			insertDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value); 
		}
		
		if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == 'blue') { 
			sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = '#CCC';
			sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Changes Saved!';
		}
}

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveDetails();
});


return navGroupWindow;


}

module.exports = appointment;
