/**
 * inputs:
 *   navGroupWindow; the navgroup its part of
 *   treatment
 */


function treatment(input) {
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/strings.js');
	Ti.include('ui/common/database/database.js');

//var navGroupWindow = input.navGroupWindow;

var treatment = {
		id: input.treatment.id?input.treatment.id:null,
		cloud_id: input.treatment.cloud_id?input.treatment.cloud_id:null,
		entry_id: input.treatment.entry_id?input.treatment.entry_id:null,
		appointment_id: input.treatment.appointment_id?input.treatment.appointment_id:null,
		start_date: input.treatment.start_date?input.treatment.start_date:timeFormatted(new Date).date,
		end_date: input.treatment.end_date?input.treatment.end_date:timeFormatted(new Date).date,
		medication: input.treatment.medication?input.treatment.medication:null,
		prescribed_by: input.treatment.prescribed_by?input.treatment.prescribed_by:null,
		diagnosis: input.treatment.diagnosis?input.treatment.diagnosis:null,
		type: input.treatment.type?input.treatment.type:'Solid',
		dosage: input.treatment.dosage?input.treatment.dosage:null,
		frequency: input.treatment.frequency?input.treatment.frequency:0,
		interval: input.treatment.interval?input.treatment.interval:'every day',
		alert: input.treatment.alert?input.treatment.alert:'Time of event',
		times: input.treatment.times?input.treatment.times:[],
		localNotifications: input.treatment.local_notifications?input.treatment.local_notifications:0,
		categories: input.treatment.categories?input.treatment.categories:[],
		symptoms: input.treatment.symptoms?input.treatment.symptoms:[],
		sideEffects: input.treatment.sideEffects?input.treatment.sideEffects:[],
		additional_notes: input.treatment.additional_notes?input.treatment.additional_notes:'No additional notes',
		status: input.treatment.status?input.treatment.status:'Scheduled',
		successful: input.treatment.successful?input.treatment.successful:'Yes/No?',
		facebook_id: input.treatment.facebook_id?input.treatment.facebook_id:null,
	}
	
	addRemoveTimes(treatment.frequency - treatment.times.length); 
	
	var share_background_color = treatment.facebook_id?'#CCC':
								(!treatment.successful)?'#CCC':(!Titanium.Network.online)?'#CCC':(!Titanium.Facebook.loggedIn)?'#CCC':'blue';


var window = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'Treatment',
  height: 'auto'
});
window.result = null;

var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(window);
	navGroupWindow.result = null;

if(treatment.id) { var cancel_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.TRASH }); }
else { var cancel_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.CANCEL }); }
window.leftNavButton = cancel_btn;

if(treatment.id) { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.DONE }); }
else { var save_btn = Titanium.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.SAVE }); }
window.rightNavButton = save_btn;

cancel_btn.addEventListener('click', function() {
	//navGroupWindow.getChildren()[0].close(window);
	if(treatment.id == null) {
		navGroupWindow.close();
		return;
	}
	
	var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to delete this treatment?', 
								message: 'This cannot be undone', 
								buttonNames: ['Yes','No'], cancel: 1 });
								
	confirm.addEventListener('click', function(g) { 
   			//Clicked cancel, first check is for iphone, second for android
   			if (g.cancel === g.index || g.cancel === true) { return; }


  			 switch (g.index) {
     		 case 0:
     		 	Ti.App.fireEvent('eventSaved'); //This is to delete all related local notifications;
     		 	
     		  	treatment.cloud_id = treatment.cloud_id?treatment.cloud_id:getTreatmentLocal(treatment.id)[0].cloud_id;
				deleteTreatmentLocal(treatment.id);			
				deleteObjectACS('treatments', treatment.cloud_id);
				navGroupWindow.result = -1;
      			navGroupWindow.close();
      			break;

      		 case 1:       			
      		 default: break;
  			}
		});
		confirm.show();
});



save_btn.addEventListener('click', function() {
/*	if(table.scrollable == false) { return; }

	var patientName_test = false, medication_test = false, dosage_test = false, frequency_test = false, symptoms_test=false, date_test = false;
	
	if(!patient.value) { alert('This treatment must be assigned to a patient'); }
	else { patientName_test=true; }
	if(!isValidDate(start_date.text)) { alert('Your start date seems to be invalid. Please recheck'); }
	else if(!isValidDate(end_date.text)) { alert('Your end date seems to be invalid. Please recheck'); }
	else if(!isStartBeforeEnd(start_date.text,end_date.text)) 
	{ alert('Your end date seems to be before your start date. Please correct'); }
	else { date_test = true; }
	if(medication.value.length >= 3) { medication_test=true; }
	else { alert('The listed medication seems to be invalid. It should be at least 3 characters'); }
	if(dosage.value.length >= 1) { dosage_test=true; }
	else { alert('You have not entered a dosage. Kindly recheck'); }
	if(frequency.value.length >= 1) { frequency_test=true; }
	else { alert('Place enter the frequency of the medication'); }
	if(symptoms_field.value == null || symptoms_field.value == '') {
		alert('You must list at least one symptom');
	}
	else { symptoms_test=true; }
	
	if(patientName_test && medication_test && dosage_test && frequency_test && symptoms_test && date_test)
	{
			if(treatment.id == null) {
				if(!Titanium.Network.online) {
					alert('Error:\n You are not connected to the internet. Cannot create new treatment');
					return;
				}
				
				
				if(treatment.appointment_id != null) {
					var appointment_id = '"'+treatment.appointment_id+'"';
					treatment.id = insertTreatmentLocal(null,appointment_id,null, start_date.text,end_date.text,medication.value,
														prescribed_by.value, diagnosis.value, type.text, dosage.value,frequency.value, interval.text);
				}
				else {
					var entry_id = '"'+treatment.entry_id+'"'; 
					treatment.id = insertTreatmentLocal(entry_id,null,null, start_date.text,end_date.text,medication.value,
														prescribed_by.value, diagnosis.value, type.text, dosage.value,frequency.value, interval.text);
				}
				createObjectACS('treatments', { id: treatment.id, start_date: start_date.text, end_date: end_date.text, 
												medication: medication.value, prescribed_by: prescribed_by.value, diagnosis: diagnosis.value,
												type: type.text, dosage: dosage.value, frequency: frequency.text, interval: interval.text });

			}
			else {
				updateTreatmentLocal(treatment.id,start_date.text,end_date.text,medication.value,prescribed_by, diagnosis, type, 
										dosage.value,frequency.text, interval.text);
			}
			if(additionalNotes_field.value) {
				updateTreatmentNotes(treatment.id, additionalNotes_field.value);
			}
			deleteSymptomsForTreatmentLocal(treatment.id);
			deleteSideEffectsForTreatmentLocal(treatment.id);
			treatment.symptoms.splice(0, treatment.symptoms.length);
			treatment.sideEffects.splice(0, treatment.sideEffects.length);
			
			if(symptoms_field.value != null) {
				if(symptoms_field.value.length > 1) {
					var final_symptoms = symptoms_field.value.split(',');
					for(var i=0;i < final_symptoms.length;i++) {
						if(final_symptoms[i].length < 2) continue;
						
						insertSymptomForTreatmentLocal(treatment.id,final_symptoms[i]);
						treatment.symptoms.push(final_symptoms[i]);
					}
				}
			}
			
			if(sideEffects_field.value != null) {
				if(sideEffects_field.value.length > 1) {
					var final_sideEffects = sideEffects_field.value.split(',');
					for(var i=0;i < final_sideEffects.length;i++) {
						if(final_sideEffects[i].length < 2) continue;
						
						insertSideEffectForTreatmentLocal(treatment.id,final_sideEffects[i]);
						treatment.sideEffects.push(final_sideEffects[i]);
					}
				}
			}
			
			
			updateTreatmentStatus(treatment.id,sectionStatus.rows[0].title);
			//var record_incident_id = getAppointmentLocal(treatment.appointment_id)[0].incident_id;
			updateRecordTimesForEntryLocal(treatment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time); */
			
			if(treatment.id != null) {
				var all_saved=true;
				
					for(var i=0; i < table.data.length; i++) {
						if(table.data[i].rows[table.data[i].rowCount-1].backgroundColor == 'blue') {
							all_saved=false;
							var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure you want to close the window?', 
									message: 'You have not saved your changes', 
									buttonNames: ['Yes','No'], cancel: 1 });
									
							confirm.addEventListener('click', function(g) { 
						   			//Clicked cancel, first check is for iphone, second for android
						   			if (g.cancel === g.index || g.cancel === true) { return; }
						
						
						  			 switch (g.index) {
						     		 case 0:
						      			navGroupWindow.close();
						      			return;
						
						      		 case 1:       			
						      		 default: return;
						  			}
								});
								confirm.show();
								
						}
					}
					if(all_saved) { 
						navGroupWindow.close(); 
						return;
					} 
			}
			else { 
				if(!validateTreatmentDetails() || !validateSymptoms()) return;
				if(!beforeSaving()) return;
				saveStatus();
				saveAdditionalNotes();
				saveTreatmentDetails();
				saveSymptoms();
				saveSideEffects();
				
				treatment.start_date = start_date.text;
				treatment.end_date = end_date.text;
				treatment.medication = medication.value;
				treatment.prescribed_by = prescribed_by.value;
				treatment.diagnosis = diagnosis.value;
				treatment.type = type.text;
				treatment.dosage = dosage.value;
				treatment.frequency = frequency.text;
				treatment.interval = interval.text;
				treatment.status = status.text;
				window.result = treatment;
				navGroupWindow.result = treatment;
				//navGroupWindow.getChildren()[0].close(window);
				navGroupWindow.close();
			}
	
});


var table = Titanium.UI.createTableView({
	showVerticalScrollIndicator: false,
	rowHeight: 45,
	//separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
	//separatorColor: 'transparent',
	//style: 1
});

var sectionStatus = Ti.UI.createTableViewSection({ headerTitle: 'Status (tap to change)', });
sectionStatus.add(Ti.UI.createTableViewRow({ height: 60, }));

var status_title = Titanium.UI.createLabel({ text: 'Status', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var status = Ti.UI.createLabel({ left: '40%', width: 150, text: treatment.status, font: { fontWeight: 'bold', fontSize: 20, }, });
sectionStatus.rows[0].add(status_title);
sectionStatus.rows[0].add(status);

var rowAdditionalNotes = Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 90, hasChild: true, });
var additional_notes = Ti.UI.createLabel({ left: 15, width: '90%', text: treatment.additional_notes, font: { fontSize: 15, }, });
rowAdditionalNotes.add(additional_notes);
if(treatment.status === 'Completed') {
	sectionStatus.add(rowAdditionalNotes);
}

if(treatment.id) {
	sectionStatus.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', })); 
	sectionStatus.rows[1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));
}

var sectionPatient = Ti.UI.createTableViewSection({ headerTitle: 'Patient (required)', });
sectionPatient.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
var patient_title = Titanium.UI.createLabel({ text: '*Individual', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var child = getChildLocal(Titanium.App.Properties.getString('child'));
child = child[0];
var patient = Titanium.UI.createTextField({ hintText: 'Patient full name', bubbleParent: false, value: child.first_name+' '+child.last_name, width: '55%', left: '45%' });
sectionPatient.rows[0].add(patient_title);
sectionPatient.rows[0].add(patient);
if(treatment.id) {
	sectionPatient.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionPatient.rows[sectionPatient.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, }));
}

var sectionDetails= Ti.UI.createTableViewSection({ headerTitle: 'Medication details(*=required)', });
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
var medication_title = Titanium.UI.createLabel({ text: '*Medication', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var medication = Titanium.UI.createTextField({ hintText: 'eg: Panadol', value: treatment.medication, width: '55%', left: '45%', bubbleParent: false, });
var diagnosis_description = Titanium.UI.createLabel({ text: 'If this treatment is related to a know diagnosis, please mention it here', left: 15, font: { fontSize: 15, }, });
var diagnosis_title = Titanium.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var diagnosis = Titanium.UI.createTextField({ hintText: "Enter diagnosis here", value: treatment.diagnosis, width: '55%', left: '45%', bubbleParent: false, });
if(treatment.symptoms.length == 0) var symptoms_message = "No symptom listed";
else if(treatment.symptoms.length == 1) var symptoms_message = treatment.symptoms.length+" symptom listed";
else var symptoms_message = treatment.symptoms.length+" symptoms listed";
var symptoms_title = Titanium.UI.createLabel({ text: symptoms_message, left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });
var type_title = Titanium.UI.createLabel({ text: '*Type', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var type = Titanium.UI.createLabel({ text: treatment.type, width: '55%', left: '45%', bubbleParent: false, });
var startDate_title = Titanium.UI.createLabel({ text: '*Start date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var start_date = Titanium.UI.createLabel({ text: treatment.start_date, width: '55%', left: '45%', bubbleParent: false, });
var endDate_title = Titanium.UI.createLabel({ text: '*End date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var end_date = Titanium.UI.createLabel({ text: treatment.end_date, width: '55%', left: '45%', bubbleParent: false, });
var dosage_title = Titanium.UI.createLabel({ text: '*Number of pills', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var dosage = Titanium.UI.createTextField({ hintText: 'eg: 1.5', value: treatment.dosage, width: '40%', left: '60%', bubbleParent: false, keyboardType: 2, });
var frequency_title = Titanium.UI.createLabel({ text: '*How Many Times?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var frequency = Titanium.UI.createLabel({ text: treatment.frequency, left: '60%', width: '40%', }); //keyboard type 4 = number pad
var interval_title = Titanium.UI.createLabel({ text: '*Interval', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var interval = Ti.UI.createLabel({ text: treatment.interval, left: '60%', width: '40%', bubbleParent: false, });
var alert_description = Titanium.UI.createLabel({ text: "You can choose how long before every scheduled medication you would "+
														"like to be alerted. For example: if you have to give the medication "+
														"twice a day, and you choose to be alerted 15 minutes before, we will "+
														"notify you 15 minutes before the two times that you choose below.", left: 15, font: { fontSize: 15, }, });
var alert_title = Titanium.UI.createLabel({ text: '*Alert at', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var alert_text = Ti.UI.createLabel({ text: treatment.alert, left: '60%', width: '40%', bubbleParent: false, });
var alertsPage_title = Titanium.UI.createLabel({ text: '('+treatment.times.length+') Times for alerts', left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });
alertsPage_title.color = (treatment.alert == 'Never' || frequency.text == 0)?'#CCC':'black';
sectionDetails.rows[0].add(medication_title);
sectionDetails.rows[0].add(medication);
sectionDetails.rows[1].add(diagnosis_description);
sectionDetails.rows[2].add(diagnosis_title);
sectionDetails.rows[2].add(diagnosis);
sectionDetails.rows[3].add(symptoms_title);
sectionDetails.rows[4].add(type_title);
sectionDetails.rows[4].add(type);
sectionDetails.rows[5].add(startDate_title);
sectionDetails.rows[5].add(start_date);
sectionDetails.rows[6].add(endDate_title);
sectionDetails.rows[6].add(end_date);
sectionDetails.rows[7].add(dosage_title);
sectionDetails.rows[7].add(dosage);
sectionDetails.rows[8].add(frequency_title);
sectionDetails.rows[8].add(frequency);
sectionDetails.rows[9].add(interval_title);
sectionDetails.rows[9].add(interval);
sectionDetails.rows[10].add(alert_description);
sectionDetails.rows[11].add(alert_title);
sectionDetails.rows[11].add(alert_text);
sectionDetails.rows[12].add(alertsPage_title);
if(treatment.id) {
	sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'No Change Made', textAlign: 'center', font: { fontSize: 15, }, }));
}

/*
var sectionOutcome = Ti.UI.createTableViewSection();
sectionOutcome.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
var success_title = Titanium.UI.createLabel({ text: 'Successful?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var successful_switcher = Titanium.UI.createSwitch({ value: treatment.successful, right: 10 });
sectionOutcome.rows[0].add(success_title);
sectionOutcome.rows[0].add(successful_switcher);

successful_switcher.addEventListener('change', function() {
		if(successful_switcher.value == true && Titanium.Network.online && 
			Titanium.Facebook.loggedIn && treatment.facebook_id == null) { 
			sectionShare.rows[0].backgroundColor = 'blue';
			return;
		}
		sectionShare.rows[0].backgroundColor = '#CCC';
	});
*/

var sectionShare = Ti.UI.createTableViewSection();
	sectionShare.add(Ti.UI.createTableViewRow({ backgroundColor: share_background_color, }));
	sectionShare.rows[0].add(Ti.UI.createLabel({ text: 'Share Treatment on Facebook', color: 'white', font: { fontWeight: 'bold', }, }));
	
	sectionShare.addEventListener('click', function() {
		if(!Titanium.Network.online) {
			alert('Sorry, an internet connection is required to share on Facebook');
			return;
		}
		if(!Titanium.Facebook.loggedIn) {
			alert('Sorry, it seems like you are not logged into Facebook');
			return;
		}
		if(treatment.facebook_id) {
			alert('This treatment has already been shared on facebook');
			return;
		}
		
		var child = getChildLocal(Titanium.App.Properties.getString('child'));
		child = child[0];
		
		var share_symptoms = symptoms_field.value.split(',');
		
		var fb_endDate = new Date(end_date.text);
		var fb_startDate = new Date(start_date.text);
		var days = parseInt((fb_endDate-fb_startDate)/(24*3600*1000));
		
		if(treatment.appointment_id) {
			var doctor_name = getDoctorByAppointmentLocal(treatment.appointment_id)[0].name;
			var description = child.first_name+" successfully completed a treatment of " + 
								treatment.medication + " over " + days + " days as prescribed by Dr. " + doctor_name;
		}
		else {
			var description = child.first_name+" successfully completed a treatment of " + treatment.medication + 
								" over " + days + " days and was cured of " + share_symptoms.length + " symptoms"; 
		}
		
		var data = {
   			link : "http://www.starsearth.com",
		    name : "Treatment successfully completed",
		    message : "By: "+child.first_name+" "+child.last_name,
		    caption : "By: "+child.first_name+" "+child.last_name,
		    picture : "http://pcfrivesdedordogne.pcf.fr/sites/default/files/imagecache/image/arton1.png",
		    description : description,
		}
		
		Titanium.Facebook.dialog("feed", data, function(e) {
		    if(e.success && e.result) {
		    	sectionShare.rows[0].backgroundColor = '#CCC';
		    	treatment.facebook_id = e.result.split('=')[1];
		    	updateTreatmentFacebookId(treatment.id, '"'+treatment.facebook_id+'"');
		        //alert("Success! New Post ID: " + e.result); Begins with post_id= 
		    } else {
		        if(e.error) {
		            alert(e.error);
		        } else {
		            alert("Dialog closed");
		        }
		    }
		});
	});

//Rules for what to display as the status
if(treatment.id) {
	if(!isValidDate(treatment.end_date) && status.text === 'Scheduled') {
		status.text = "Complete";
	}
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
	
	if(treatment.entry_id == null) {
		alert('logic for this not entered. must find an existing entry based on diagnosis, category, symptoms/goals');
		return false;
	}
	
	if(treatment.id == null) {
		var appointment_id=null;
		var appointment_cloud_id=null;
		if(treatment.appointment_id != null) {
				appointment_cloud_id = getAppointmentLocal(treatment.appointment_id)[0].cloud_id;
				appointment_id = '"'+treatment.appointment_id+'"';
		}
			var entry_id = '"'+treatment.entry_id+'"'; 
			treatment.id = insertTreatmentLocal(entry_id,appointment_id,start_date.text,end_date.text,medication.value,
											type.text, dosage.value,frequency.text, interval.text, alert_text.text);
		
		var entry_cloud_id = getEntryLocal(treatment.entry_id)[0].cloud_id;
		createObjectACS('treatments', { id: treatment.id,
										appointment_id: appointment_cloud_id, 
										entry_id:  entry_cloud_id, 
										start_date: treatment.start_date,
										end_date: treatment.end_date,
										medication: medication.value,
										//prescribed_by: prescribed_by.value,
										diagnosis: diagnosis.value, 
										type: type.text,
										dosage: dosage.value,
										frequency: frequency.text,
										interval: interval.text,
										alert: alert_text.text,
										symptoms: treatment.symptoms,
										additional_notes: additional_notes.text,
										status: status.text,
										//facebook_id: treatment.facebook_id,
									});
									
	}
	updateRecordTimesForEntryLocal(treatment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
	
	return true;
}

function addRemoveTimes(how_many) {
	if(how_many > 0) {
		for(var i=0; i < how_many; i++) {
			var theTime = roundMinutes(new Date());
			theTime = timeFormatted(theTime);
			treatment.times.push(theTime.time);
		}
	}
	else {
		for(var i=0; i < how_many*(-1); i++) {
			treatment.times.pop();
		}
	}
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
	if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == 'blue') {
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = '#CCC';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Changes Saved!';
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
							message: 'You must declare this treatment as scheduled in order to edit this field.'+
										' Would you like to change the status to scheduled?', 
							buttonNames: ['Yes','No'], cancel: 1 });
										
					confirm.addEventListener('click', function(g) { 
				  			//Clicked cancel, first check is for iphone, second for android
				   		if (g.cancel === g.index || g.cancel === true) { return; }
							
							
				  		 switch (g.index) {
				     		 case 0:
				     		 	if(status.text === 'Completed') {
				     		 		table.deleteRow(rowEndNotes);
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


function saveStatus()
{
	updateTreatmentLocal(treatment.id, 'status', status.text);
	treatment.status = status.text;
	if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == 'blue')	{
		sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = '#CCC';
		sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved!';
	}
	return true;
}

function saveAdditionalNotes()
{
	updateTreatmentLocal(activity.id, 'additional_notes', additional_notes.text);
	
	if(sectionStatus.rows[row_index].backgroundColor == 'blue') {
		sectionStatus.rows[row_index].backgroundColor = '#CCC';
		sectionStatus.rows[row_index].children[0].text = 'Changes Saved';
	}
	return true;
}

function saveStatusData()
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

status.addEventListener('click', function() {	
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
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: status, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			//The diagnosis section must only show if the appointment has been completed
			if(modalPicker.result == 'Completed' && status.text != 'Completed') {
				table.insertRowAfter(0, rowAdditionalNotes);
			}
			if(modalPicker.result != 'Complete' && status.text == 'Completed') {
				table.deleteRow(rowAdditionalNotes);
			}
			if(modalPicker.result == 'Completed' || modalPicker.result == 'Cancelled') {
				blurSection(sectionDetails);
			}
			if(modalPicker.result == 'Scheduled') {
				unBlurSection(sectionDetails);
			}
			if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') {
				sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
				sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
			} 
			status.text = modalPicker.result;
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
		additional_notes_text = additional_notes.text;
	}
	additional_notes_page = new additional_notes_page('Additional Notes', "Make any additional notes regarding the outcome of this treatment "+
													"such as unexpected side effects.", additional_notes_text);
	var children = navGroupWindow.getChildren();
	children[0].open(additional_notes_page);
													
	additional_notes_page.addEventListener('close', function() {
		if(!additional_notes_page.result) {
			additional_notes.text = "No additional notes";
		}
		else {
			additional_notes.text = additional_notes_page.result;
		}
	});
	
	if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == '#CCC') {
		sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = 'blue';
		sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Save Changes';
	}
});

function validateTreatmentDetails()
{
	if(medication.value.length < 1) { 
		alert('You do not seem to have listed a medication.');
		return false; 
	}
	
	if(!isValidDate(start_date.text)) { 
		alert('Your start date seems to be invalid. Please pick a date in the present or future.');
		return false; 
	}
	if(!isValidDate(end_date.text)) { 
		alert('Your end date seems to be invalid. Please pick a date in the present or future');
		return false;
	}
	
	if(!isStartBeforeEnd(start_date.text,end_date.text)) { 
		alert('Your end date seems to be before your start date. Please correct'); 
		return false;
	}
	
	if(dosage.value.length < 1) {
		if(dosage_title.text === '*Number of pills') alert('You have not entered the number of pills');
		else alert('You do not seem to have entered the dosage.');
		return false;
	}
	if(frequency.text == 0) {
		alert('How many times will the medication be given? Must be greater than 0.');
		return false;
	}
	
	if(frequency.text != treatment.times.length) {
		alert("You have mentioned that you will be administering this medication "+frequency.text+
				" times a day but you have mentioned "+treatment.times.length+" times to be notified. Kindly recheck.");
		return false;
	}
	
	return true;
}

function validateSymptoms()
{
	if(treatment.symptoms.length < 1) {
		alert('You must list at least one symptom');
		return false;
	}
	return true;
}

function saveTreatmentDetails()
{		
	updateTreatmentLocal(treatment.id, 'medication', medication.value);
	//updateTreatmentLocal(treatment.id, 'prescribed_by', prescribed_by.value);
	updateTreatmentLocal(treatment.id, 'diagnosis', diagnosis.value);
	updateTreatmentLocal(treatment.id, 'type', type.text);
	updateTreatmentLocal(treatment.id, 'start_date', start_date.text);
	updateTreatmentLocal(treatment.id, 'end_date', end_date.text);
	updateTreatmentLocal(treatment.id, 'dosage', dosage.value);
	updateTreatmentLocal(treatment.id, 'frequency', frequency.text);
	updateTreatmentLocal(treatment.id, 'interval', interval.text);
	updateTreatmentLocal(treatment.id, 'alert', alert_text.text);
		
	deleteTimesForTreatmentLocal(treatment.id);
	
	for(var i=0; i < treatment.times.length; i++) {
		insertTimeForTreatmentLocal(treatment.id, treatment.times[i]);
	}
	
	treatment.medication = medication.text;
	treatment.prescribed_by = prescribed_by.text;
	treatment.diagnosis = diagnosis.text;
	treatment.start_date = start_date.text;
	treatment.end_date = end_date.text;	
	treatment.type = type.text;
	treatment.dosage = dosage.value;
	treatment.frequency = frequency.text;
	treatment.interval = interval.text;
	treatment.alert = alert_text.text;
}

function saveSymptoms() 
{		
	deleteSymptomsForTreatmentLocal(treatment.id);
		
	for(var i=0; i < treatment.symptoms.length; i++) {
		treatment.symptoms[i] = removeWhiteSpace(treatment.symptoms[i]);
		insertSymptomForTreatmentLocal(treatment.id, treatment.symptoms[i]);
	}
}


function saveSideEffects() 
{		
	deleteSideEffectsForTreatmentLocal(treatment.id);
		
	for(var i=0; i < treatment.sideEffects.length; i++) {
		treatment.sideEffects[i] = removeWhiteSpace(treatment.sideEffects[i]);
		insertSideEffectForTreatmentLocal(treatment.id, treatment.sideEffects[i]);
	}
		
}


//Functions that works with the modal picker to change the date
//input: date: the object that we need to work with(label object)
function changeDate(date)
{
var modalPicker = require('ui/common/helpers/modalPicker');
modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE,null,date.text); 

if(window.leftNavButton != null) { 
	window.leftNavButton.setTouchEnabled(false);
}
window.rightNavButton.setTouchEnabled(false); 
window.setTouchEnabled(false);
table.scrollable = false;
if(Titanium.Platform.osname == 'iphone') modalPicker.open();
if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: date, });


	var picker_closed = function() {
		if(modalPicker.result) { 
			var newDate = modalPicker.result.toDateString();
			date.text = newDate;
			if(sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor == '#CCC') {
				sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor = 'blue';
				sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].children[0].text = 'Save Changes';
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
}

start_date.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	changeDate(start_date);
	treatment.start_date = start_date.text;
	});
end_date.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	changeDate(end_date);
	treatment.end_date = end_date.text;
	});

symptoms_title.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}		
	var symptoms_page = require('ui/common/helpers/items');
	symptoms_page = new symptoms_page(treatment.symptoms, 'Symptoms');
	var children = navGroupWindow.getChildren();
	children[0].open(symptoms_page);
	
	symptoms_page.addEventListener('close', function() {
		treatment.symptoms = symptoms_page.result;
		if(treatment.symptoms.length == 0) symptoms_title.text = "No symptoms listed"; 
		else if(treatment.symptoms.length == 1) symptoms_title.text = treatment.symptoms.length+" symptom listed";
		else if(treatment.symptoms.length > 1) symptoms_title.text = treatment.symptoms.length+ " symptoms listed";
		if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == '#CCC') {
			sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
			sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = "Save Changes";
		} 
	});
});

medication.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) return;
	}
});

medication.addEventListener('blur', function() {
	activateSaveButton();
});

diagnosis.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) return;
	}
});

diagnosis.addEventListener('blur', function() {
	activateSaveButton();
});
	
type.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	var data = [];
	data[0] = 'Solid';
	data[1] = 'Liquid';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,type.text); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: type, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			//The diagnosis section must only show if the appointment has been completed
			if(modalPicker.result == 'Solid') {	
				dosage_title.text = '*Number of pills';
				dosage.hintText = '1.5';
			}
			else {
				dosage_title.text = '*Dosage';
				dosage.hintText = '2 tablespoons';
			}
			if(modalPicker.result == treatment.type) {
				dosage.value = treatment.dosage;
				frequency.text = treatment.frequency;
				interval.text = treatment.interval;
			}
			else { 
				dosage.value = '';
				frequency.text = 0;
				interval.text = 'every day';
			}
			type.text = modalPicker.result;
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

dosage.addEventListener('click', function(e) {
	if(isBlurred(e)) {
		if(!changeStatusAndUnblur()) return;
	}
});

dosage.addEventListener('blur', function() {
	activateSaveButton();
});
	
frequency.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	var data = '123456789';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(null,data,frequency.text); 

	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: frequency, });


	var picker_closed = function() {
		if(modalPicker.result) { 
			if(modalPicker.result != frequency.text) {
				activateSaveButton();
				if(modalPicker.result == 0 || alert_text.text == 'Never') {
					alertsPage_title.color = '#CCC';
				}
				else {
					alertsPage_title.color = 'black';
					addRemoveTimes(modalPicker.result - frequency.text);
				}
				alertsPage_title.text = '('+modalPicker.result+') Times for alerts';
			}
			frequency.text = modalPicker.result;
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
	
interval.addEventListener('click', function(e) {
	//no need to produce a picker here. Keep at every day for now 
	return;
	//no further action here 
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}	
	
	var data = [];
	data[0] = 'every day';
	data[1] = 'every week';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(null,data,interval.text); 

	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: interval, });


	var picker_closed = function() {
		if(modalPicker.result) {
			if(modalPicker.result != interval.text) {
				activateSaveButton();
			} 
			interval.text = modalPicker.result;
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
	data[0] = 'Time of event';
	data[1] = '5 minutes before';
	data[2] = '10 minutes before';
	data[3] = '15 minutes before';
	data[4] = '30 minutes before';
	data[5] = '1 hour before';
	data[6] = 'Never';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(null,data,alert_text.text); 

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
			if(modalPicker.result != alert_text.text) {
				activateSaveButton();	
			}
			if(modalPicker.result == 'Never' || frequency.text == 0) {
				alertsPage_title.color = '#CCC';
			}
			else {
				alertsPage_title.color = 'black';
				addRemoveTimes(frequency.text - treatment.times.length);
			}
			alert_text.text = modalPicker.result;
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

alertsPage_title.addEventListener('click', function(e) {
if(isBlurred(e)) {
	if(!changeStatusAndUnblur()) return;
}
	
if(this.color == '#CCC') {
	alert("You have to set 'How many times' to 1 or more and Alert must not be 'Never' in order for you to set times");
	return;
}
	
	var alerts_page = require('ui/common/helpers/alerts');
	alerts_page = new alerts_page(treatment.times, alert_text.text);
	var children = navGroupWindow.getChildren();
	children[0].open(alerts_page);
	
	alerts_page.addEventListener('close', function() {
		treatment.times = alerts_page.result;
		frequency.text = treatment.times.length;
		alertsPage_title.text = '('+treatment.times.length+') Times for alerts';
		if(treatment.times.length == 0) {
			alertsPage_title.color = '#CCC';
		}
		activateSaveButton();
	});  
});

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		if(!validateTreatmentDetails() || !validateSymptoms()) return;
		if(!beforeSaving()) return;
		saveTreatmentDetails();
		saveSymptoms();
		saveSideEffects();
		
		Ti.App.fireEvent('eventSaved');
		deactivateSaveButton();
	}
});


	return navGroupWindow;
};

module.exports = treatment;