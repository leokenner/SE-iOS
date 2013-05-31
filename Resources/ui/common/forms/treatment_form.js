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
		times: input.treatment.times?input.treatments.times:[],
		localNotifications: input.treatment.local_notifications?input.treatment.local_notifications:[],
		categories: input.treatment.categories?input.treatment.categories:[],
		symptoms: input.treatment.symptoms?input.treatment.symptoms:[],
		sideEffects: input.treatment.sideEffects?input.treatment.sideEffects:[],
		additionalNotes: input.treatment.additional_notes?input.treatment.additional_notes:null,
		status: input.treatment.status?input.treatment.status:'Scheduled',
		successful: input.treatment.successful?input.treatment.successful:'Yes/No?',
		facebook_id: input.treatment.facebook_id?input.treatment.facebook_id:null,
	}
	
	var categories_string='';
	for(var i=0;i < treatment.categories.length; i++) {
		categories_string += treatment.categories[i];
		if(i != treatment.categories.length -1) categories_string += ', ';
	}
	
	var symptoms_string='';
	for(var i=0;i < treatment.symptoms.length; i++) {
		symptoms_string += treatment.symptoms[i];
		if(i != treatment.symptoms.length -1) symptoms_string += ', ';
	}
	
	var sideEffects_string='';
	for(var i=0;i < treatment.sideEffects.length; i++) {
		sideEffects_string += treatment.sideEffects[i];
		if(i != treatment.sideEffects.length -1) sideEffects_string += ', ';
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
				navGroupWindow.close(); 
				return; 
			}
			if(!validateDetails() || !validateSolidLiquid() || !validateCategories() || !validateSymptoms() || !validateSideEffects()) return;
			if(!beforeSaving()) return;
			saveStatus();
			saveAdditionalNotes();
			saveDetails();
			saveSolidLiquid();
			saveCategories();
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
sectionStatus.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
var status_title = Titanium.UI.createLabel({ text: 'Status', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var status = Ti.UI.createLabel({ left: '40%', width: 150, text: treatment.status, font: { fontWeight: 'bold', fontSize: 20, }, });
sectionStatus.rows[0].add(status_title);
sectionStatus.rows[0].add(status);
sectionStatus.rows[1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));

var sectionAdditionalNotes = Ti.UI.createTableViewSection({ headerTitle: 'Additional Notes', });
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ height: 135, selectedBackgroundColor: 'white' }));
sectionAdditionalNotes.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC' }));
var successful_title = Titanium.UI.createLabel({ text: "Was it successful? If the patient was successfully cured "+
												"of the symptoms listed with no unknown side effects, select Yes, otherwise "+
												"select No.", left: 15, font: { fontSize: 18, }, });
var successful = Ti.UI.createLabel({ left: 15, width: '100%', text: treatment.successful, bubbleParent: false, font: { fontWeight: 'bold', fontSize: 20, }, });
sectionAdditionalNotes.rows[0].add(successful_title);
sectionAdditionalNotes.rows[1].add(successful);
sectionAdditionalNotes.rows[2].add(Ti.UI.createLabel({ text: 'Make additional notes about the outcome of the treatment, such as undocumented side-effects', left: 15, }));
var additionalNotes_field = Titanium.UI.createTextArea({ hintText: 'Additional notes', bubbleParent: false, value: treatment.additionalNotes, width: '100%', top: 5, font: { fontSize: 17 }, height: 115, borderRadius: 10 });
sectionAdditionalNotes.rows[3].add(additionalNotes_field);
sectionAdditionalNotes.rows[4].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, width: '80%', }));

var sectionPatient = Ti.UI.createTableViewSection({ headerTitle: 'Patient (required)', });
sectionPatient.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'black', }));
var patient_title = Titanium.UI.createLabel({ text: '*Patient', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var child = getChildLocal(Titanium.App.Properties.getString('child'));
child = child[0];
var patient = Titanium.UI.createTextField({ hintText: 'Patient full name', bubbleParent: false, value: child.first_name+' '+child.last_name, width: '55%', left: '45%' });
sectionPatient.rows[0].add(patient_title);
sectionPatient.rows[0].add(patient);
if(treatment.id) {
	sectionPatient.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionPatient.rows[sectionPatient.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
}

var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Details(* = required)' });
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white',}));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white',}));
var startDate_title = Titanium.UI.createLabel({ text: '*Start date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var start_date = Titanium.UI.createLabel({ text: treatment.start_date, width: '55%', left: '45%', bubbleParent: false, });
var endDate_title = Titanium.UI.createLabel({ text: '*End date', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var end_date = Titanium.UI.createLabel({ text: treatment.end_date, width: '55%', left: '45%', bubbleParent: false, });
var medication_title = Titanium.UI.createLabel({ text: '*Medication', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var medication = Titanium.UI.createTextField({ hintText: 'eg: Panadol', value: treatment.medication, width: '55%', left: '45%', bubbleParent: false, });
var prescribed_by_description = Titanium.UI.createLabel({ text: 'If this treatment was prescribed by a doctor, enter their name here. Else leave blank', left: 15, font: { fontSize: 15, }, });
var prescribed_by_title = Titanium.UI.createLabel({ text: 'Prescribed by', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var prescribed_by = Titanium.UI.createTextField({ hintText: "Doctor's name here", value: treatment.prescribed_by, width: '55%', left: '45%', bubbleParent: false, });
var diagnosis_description = Titanium.UI.createLabel({ text: 'If this treatment is related to a know diagnosis, please mention it here', left: 15, font: { fontSize: 15, }, });
var diagnosis_title = Titanium.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var diagnosis = Titanium.UI.createTextField({ hintText: "Enter diagnosis here", value: treatment.diagnosis, width: '55%', left: '45%', bubbleParent: false, });
var type_title = Titanium.UI.createLabel({ text: '*Type', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var type = Titanium.UI.createLabel({ text: treatment.type, width: '55%', left: '45%', bubbleParent: false, });
sectionDetails.rows[0].add(startDate_title);
sectionDetails.rows[0].add(start_date);
sectionDetails.rows[1].add(endDate_title);
sectionDetails.rows[1].add(end_date);
sectionDetails.rows[2].add(medication_title);
sectionDetails.rows[2].add(medication);
sectionDetails.rows[3].add(prescribed_by_description);
sectionDetails.rows[4].add(prescribed_by_title);
sectionDetails.rows[4].add(prescribed_by);
sectionDetails.rows[5].add(diagnosis_description);
sectionDetails.rows[6].add(diagnosis_title);
sectionDetails.rows[6].add(diagnosis);
sectionDetails.rows[7].add(type_title);
sectionDetails.rows[7].add(type);
if(treatment.id) {
	sectionDetails.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionDetails.rows[sectionDetails.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
}

var sectionSolidLiquid= Ti.UI.createTableViewSection({ headerTitle: treatment.type+' medication', });
sectionSolidLiquid.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionSolidLiquid.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionSolidLiquid.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionSolidLiquid.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionSolidLiquid.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', }));
sectionSolidLiquid.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', hasChild: true, }));
var dosage_title = Titanium.UI.createLabel({ text: '*Number of pills', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var dosage = Titanium.UI.createTextField({ hintText: 'eg: 1.5', value: treatment.dosage, width: '40%', left: '60%', bubbleParent: false, keyboardType: 2, });
var frequency_title = Titanium.UI.createLabel({ text: '*How Many Times?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var frequency = Titanium.UI.createLabel({ text: treatment.frequency, left: '60%', width: '40%', }); //keyboard type 4 = number pad
var interval_title = Titanium.UI.createLabel({ text: '*Interval', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var interval = Ti.UI.createLabel({ text: treatment.interval, left: '60%', width: '40%', bubbleParent: false, });
var alert_description = Titanium.UI.createLabel({ text: "You can choose how long before every scheduled medication you would "+
														"like to be alerted. For example: if you have to take the medication "+
														"twice a day, and you choose to be alerted 15 minutes before, we will "+
														"notify you 15 minutes before the two times that you choose below.", left: 15, font: { fontSize: 15, }, });
var alert_title = Titanium.UI.createLabel({ text: '*Alert', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var alert_text = Ti.UI.createLabel({ text: treatment.alert, left: '60%', width: '40%', bubbleParent: false, });
var alertsPage_title = Titanium.UI.createLabel({ text: 'Times for alerts', left: 15, width: '100%', font: { fontWeight: 'bold', fontSize: 18, }, });
alertsPage_title.color = (treatment.alert == 'Never' || frequency.text == 0)?'#CCC':'black';
sectionSolidLiquid.rows[0].add(dosage_title);
sectionSolidLiquid.rows[0].add(dosage);
sectionSolidLiquid.rows[1].add(frequency_title);
sectionSolidLiquid.rows[1].add(frequency);
sectionSolidLiquid.rows[2].add(interval_title);
sectionSolidLiquid.rows[2].add(interval);
sectionSolidLiquid.rows[3].add(alert_description);
sectionSolidLiquid.rows[4].add(alert_title);
sectionSolidLiquid.rows[4].add(alert_text);
sectionSolidLiquid.rows[5].add(alertsPage_title);
if(treatment.id) {
	sectionSolidLiquid.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
}

var sectionCategories = Ti.UI.createTableViewSection();
var categories_field = Titanium.UI.createTextArea({ hintText: 'Seperate each category by comma', value: categories_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
//if(!treatment.appointment_id) { 
	sectionCategories.headerTitle = 'Categories(list using commas)';
	sectionCategories.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
	sectionCategories.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
	sectionCategories.rows[0].add(Ti.UI.createLabel({
									left: 5,
									width: '90%',  
									text: "Please list the categories that you feel this treatment applies to. For example, "+
											"if it is about a health issue, please enter health. If it is a behavioral issue, "+
											"please enter behavior. If you feel it is both a health and behavior issue, enter heath, behavior"+
											" Minimum one category required. ", }));	
	
	sectionCategories.rows[1].add(categories_field);
	if(treatment.id) {
		sectionCategories.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
		sectionCategories.rows[sectionCategories.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
	}
//}

var sectionSymptoms = Ti.UI.createTableViewSection({ headerTitle: '*Symptoms(list using commas)' });
sectionSymptoms.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
var symptoms_explanation = Ti.UI.createLabel({ text: 'Please list the symptoms this treatment is intended for. Separate each symptom using a comma. You must list at least one.', left: 15, })
var symptoms_field = Titanium.UI.createTextArea({ hintText: 'Seperate each symptom by comma', value: symptoms_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10, bubbleParent: false, });
sectionSymptoms.rows[0].add(symptoms_explanation);
sectionSymptoms.rows[1].add(symptoms_field);
if(treatment.id) {
	sectionSymptoms.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionSymptoms.rows[sectionSymptoms.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
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
var sectionSideEffects = Ti.UI.createTableViewSection({ headerTitle: 'Known Side effects(list using commas)' });
sectionSideEffects.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionSideEffects.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
sectionSideEffects.rows[0].add(Ti.UI.createLabel({ text: "List any of the medication's known side effects. Seperate each with a comma.", left: 15, }));
var sideEffects_field = Titanium.UI.createTextArea({ hintText: 'Seperate each entry by comma', value: sideEffects_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10, bubbleParent: false, });
sectionSideEffects.rows[1].add(sideEffects_field);
if(treatment.id) {
	sectionSideEffects.add(Ti.UI.createTableViewRow({ backgroundColor: '#CCC', }));
	sectionSideEffects.rows[sectionSideEffects.rowCount-1].add(Ti.UI.createLabel({ text: 'Changes Saved!', textAlign: 'center', font: { fontSize: 15, }, }));
}



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
		if(!successful_switcher.value) {
			alert('You must declare a treatment successful in order to be able to share it on Facebook');
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

var sectionDelete = Ti.UI.createTableViewSection();
sectionDelete.add(Ti.UI.createTableViewRow({ backgroundColor: treatment.id?'red':'#CCC', 
											}));
sectionDelete.rows[0].add(Ti.UI.createLabel({ text: 'Delete Treatment', color: 'white', font: { fontWeight: 'bold', },  }));

sectionDelete.addEventListener('click', function() {
	if(!treatment.id) {
		alert('This treatment has not been saved. If you wish to delete it, simply press cancel at the top left corner');
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
     		  	treatment.cloud_id = treatment.cloud_id?treatment.cloud_id:getTreatmentLocal(treatment.id)[0].cloud_id;
				deleteTreatmentLocal(treatment.id);			
				deleteObjectACS('treatments', treatment.cloud_id);
				window.result = -1;
				navGroupWindow.result = -1;
				//input.navGroupWindow.getChildren()[0].close(window);
      			navGroupWindow.close();
      			break;

      		 case 1:       			
      		 default: break;
  			}
		});
		confirm.show();
});

//Rules for what to display as the status
if(treatment.id) {
	if(!isValidDate(treatment.end_date) && status.text === 'Scheduled') {
		status.text = "Complete";
	}
	if(treatment.status == "Completed") {
		table.data = [sectionStatus, sectionAdditionalNotes, sectionCategories, sectionPatient, sectionDetails, sectionSolidLiquid, sectionSymptoms, sectionSideEffects];	
	}
	else {
		table.data = [sectionStatus, sectionCategories, sectionPatient, sectionDetails, sectionSolidLiquid,sectionSymptoms, sectionSideEffects];	
	}
}
else {
	table.data = [sectionCategories, sectionPatient, sectionDetails, sectionSolidLiquid, sectionSymptoms, sectionSideEffects];
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
	
	if(status.text == 'Completed' && successful.text == 'Yes/No?') {
		alert('Please declare whether the treatment was successful or unsuccessful');
		table.scrollToIndex(2);
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
											type.text, dosage.value,frequency.text, interval.text);
		
		var entry_cloud_id = getEntryLocal(treatment.entry_id)[0].cloud_id;
		createObjectACS('treatments', { id: treatment.id,
										appointment_id: appointment_cloud_id, 
										entry_id:  entry_cloud_id, 
										start_date: treatment.start_date,
										end_date: treatment.end_date,
										medication: medication.value,
										prescribed_by: prescribed_by.value,
										diagnosis: diagnosis.value, 
										type: type.text,
										dosage: dosage.value,
										frequency: frequency.text,
										interval: interval.text,
										categories: (categories_field.value.replace(".",",")).split(','),
										symptoms: (symptoms_field.value.replace(".",",")).split(','),
										sideEffects: (sideEffects_field.value.replace(".",",")).split(','),
										additional_notes: additionalNotes_field.value,
										status: status.text,
										facebook_id: treatment.facebook_id,
									});
									
	}
	updateRecordTimesForEntryLocal(treatment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
	
	return true;
}

function saveStatus()
{
	if(!beforeSaving()) return;
	updateTreatmentLocal(treatment.id, 'status', status.text);
	treatment.status = status.text;
	if(sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor == 'blue')	sectionStatus.rows[sectionStatus.rowCount-1].backgroundColor = '#CCC';
	if(status.text != 'Scheduled') sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved!';
	else { sectionStatus.rows[sectionStatus.rowCount-1].children[0].text = 'Changes Saved-Pleased change dates below'; }
}

sectionStatus.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') {
		saveStatus();
		return;
	}
	
	var data = [];
	data[0] = 'Scheduled';
	data[1] = 'Completed';
	data[2] = 'Cancelled';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,sectionStatus.rows[0].title); 
	
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
				table.data = [sectionStatus, sectionAdditionalNotes, sectionCategories, sectionPatient, sectionDetails, sectionSolidLiquid, sectionSymptoms, sectionSideEffects];
			}
			if(modalPicker.result != 'Complete' && status.text == 'Completed') {
				table.data = [sectionStatus, sectionCategories, sectionPatient, sectionDetails, sectionSolidLiquid, sectionSymptoms, sectionSideEffects];
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

function saveAdditionalNotes()
{
	if(!beforeSaving()) return;
	
	updateTreatmentLocal(treatment.id, 'successful', successful.text);
	updateTreatmentLocal(treatment.id, 'additional_notes', additionalNotes_field.value);
	treatment.successful = successful.text;
	treatment.additionalNotes = additionalNotes_field.value;
	
	if(sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor == 'blue') {
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor = '#CCC';
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].children[0].text = 'Changes Saved';
	}
}

sectionAdditionalNotes.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveAdditionalNotes();
});

successful.addEventListener('click', function() {
	var data = [];
	data[0] = 'Yes';
	data[1] = 'No';
	
	var modalPicker = require('ui/common/helpers/modalPicker');
	modalPicker = new modalPicker(null,data,successful.text); 
	
	if(window.leftNavButton != null) { 
		window.leftNavButton.setTouchEnabled(false);
	}
	window.rightNavButton.setTouchEnabled(false); 
	window.setTouchEnabled(false);
	table.scrollable = false;
	if(Titanium.Platform.osname == 'iphone') modalPicker.open();
	if(Titanium.Platform.osname == 'ipad') modalPicker.show({ view: successful, });
	
	
	var picker_closed = function() {
		if(modalPicker.result) {
			if(modalPicker.result != successful.text) {
				if(sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor == '#CCC') {
					sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor = 'blue';
					sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].children[0].text = 'Changes Saved!';
				}
			}
			successful.text = modalPicker.result;
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


additionalNotes_field.addEventListener('blur', function() {
	if(additionalNotes_field.value.length > 0 && sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor == '#CCC') {
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].backgroundColor = 'blue';
		sectionAdditionalNotes.rows[sectionAdditionalNotes.rowCount-1].children[0].text = 'Save Changes';
	}
});

function validateDetails()
{
	if(!isValidDate(start_date.text)) { 
		alert('Your start date seems to be invalid. Please pick a date in the present or future.');
		return false; 
	}
	else if(!isValidDate(end_date.text)) { 
		alert('Your end date seems to be invalid. Please pick a date in the present or future');
		return false;
	}
	else if(!isStartBeforeEnd(start_date.text,end_date.text)) { 
		alert('Your end date seems to be before your start date. Please correct'); 
		return false;
	}
	if(medication.value.length < 1) { 
		alert('You do not seem to have listed a medication.');
		return false; 
	}
	
	return true;
}

function saveDetails()
{
	if(!validateDetails()) return;
	if(!beforeSaving()) return;
	
	updateTreatmentLocal(treatment.id, 'start_date', start_date.text);
	updateTreatmentLocal(treatment.id, 'end_date', end_date.text);
	updateTreatmentLocal(treatment.id, 'medication', medication.value);
	updateTreatmentLocal(treatment.id, 'prescribed_by', prescribed_by.value);
	updateTreatmentLocal(treatment.id, 'diagnosis', diagnosis.value);
	updateTreatmentLocal(treatment.id, 'type', type.text);
	
	treatment.start_date = start_date.text;
	treatment.end_date = end_date.text;
	treatment.medication = medication.text;
	treatment.prescribed_by = prescribed_by.text;
	treatment.diagnosis = diagnosis.text;
	treatment.type = type.text;
	
	if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == 'blue') {
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = '#CCC';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Changes Saved';
	}
}

sectionDetails.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveDetails();
});




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
			if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == '#CCC') {
				sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
				sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changes';
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



start_date.addEventListener('click', function() {
	changeDate(start_date);
	treatment.start_date = start_date.text;
	});
end_date.addEventListener('click', function() {
	changeDate(end_date);
	treatment.end_date = end_date.text;
	});
medication.addEventListener('blur', function() {
	if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == '#CCC') {
		sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
		sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changes';
	}
});
	
type.addEventListener('click', function() {
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
			sectionSolidLiquid.headerTitle = modalPicker.result+' medication';
			type.text = modalPicker.result;
			if(sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor == '#CCC') {
				sectionDetails.rows[sectionDetails.rowCount-1].backgroundColor = 'blue';
				sectionDetails.rows[sectionDetails.rowCount-1].children[0].text = 'Save Changes';
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

function validateSolidLiquid()
{
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


function saveSolidLiquid()
{
	if(!validateSolidLiquid()) return;
	if(!beforeSaving()) return;
	
	updateTreatmentLocal(treatment.id, 'dosage', dosage.value);
	updateTreatmentLocal(treatment.id, 'frequency', frequency.text);
	updateTreatmentLocal(treatment.id, 'interval', interval.text);
	
	deleteTimesForTreatmentLocal(treatment.id);
	
	var days = Math.floor(( Date.parse(end_date.text) - Date.parse(start_date.text) ) / 86400000);
	if(alert_text.text === 'Time of event') var advance = 0;
	else var advance = alert_text.text.split(' ')[0];
	if(type.text == 'Solid') {
		var alertBody = dosage.text+" pills of "+medication.text+" for "+child.first_name;
	}
	else {
		var alertBody = dosage.text+" of "+medication.text+" for "+child.first_name;
	}
	var i=0;
	var d = new Date(start_date.text+' '+treatment.times[0]);
	
	if(alert_text.text != 'Never') {	
		do {
				treatment.localNotifications[i] = [];
				d.setDate(d.getDate()+i); 	
				for(var j=0; j < treatment.times.length; j++) {
					if(advance < 5) //It means the text was alert time is in the hours
						d.setHours(new Date(start_date.text+' '+treatment.times[j]).getHours()-advance);
					else 
						d.setMinutes(new Date(start_date.text+' '+treatment.times[j]).getMinutes()-advance);
					
					var local_notification_id = d.getTime();
					
					if(!treatment.localNotifications[i][j]) { 
						treatment.localNotifications[i][j] = local_notification_id;
						Ti.App.iOS.scheduleLocalNotification({ 
							alertBody: alertBody, 
							alertAction: "view details", 
							userInfo: {"id": local_notification_id }, 
							date: new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null),  
						});
					}	
				}
				i++;
		} while(i < days);
	}

	Ti.API.info(treatment.localNotifications);
	
	treatment.dosage = dosage.value;
	treatment.frequency = frequency.text;
	treatment.interval = interval.text;
	
	if(sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor == 'blue') {
		sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor = '#CCC';
		sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].children[0].text = 'Changes Saved';
	}
}

sectionSolidLiquid.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveSolidLiquid();
});

dosage.addEventListener('blur', function() {
	if(sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor == '#CCC') {
			sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor = 'blue';
			sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].children[0].text = 'Save Changes';
	}
});

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
	
frequency.addEventListener('click', function() {
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
				if(sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor == '#CCC') {
					sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor = 'blue';
					sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].children[0].text = 'Save Changes';
				}
				if(modalPicker.result == 0 || alert_text.text == 'Never') {
					alertsPage_title.color = '#CCC';
				}
				else {
					alertsPage_title.color = 'black';
					addRemoveTimes(modalPicker.result - frequency.text);
				}
				
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
	
interval.addEventListener('click', function() {
	//no need to produce a picker here. Keep at every day for now 
	return;
	//no further action here 
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
				if(sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor == '#CCC') {
					sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor = 'blue';
					sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].children[0].text = 'Save Changes';
				}
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


alert_text.addEventListener('click', function() {
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
				if(sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor == '#CCC') {
					sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor = 'blue';
					sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].children[0].text = 'Save Changes';
				}	
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

alertsPage_title.addEventListener('click', function() {
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
		if(treatment.times.length == 0) {
			alertsPage_title.color = '#CCC';
		}
		if(sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor == '#CCC') {
			sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].backgroundColor = 'blue';
			sectionSolidLiquid.rows[sectionSolidLiquid.rowCount-1].children[0].text = 'Save Changes';
		}
	});  
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
	if(!validateCategories()) return;	
	if(!beforeSaving()) return;
		
		deleteCategoriesForTreatmentLocal(treatment.id);
			treatment.categories.splice(0, treatment.categories.length);
			
			if(categories_field.value != null) {
				if(categories_field.value.length > 1) {
					categories_field.value.replace(".",",");
					var final_categories = categories_field.value.split(',');
					for(var i=0;i < final_categories.length;i++) {
						if(final_categories[i].length < 2) continue;
						final_categories[i] = removeWhiteSpace(final_categories[i]);
						insertCategoryForTreatmentLocal(treatment.id,final_categories[i]);
						treatment.categories.push(final_categories[i]);
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
})

categories_field.addEventListener('blur', function() {
	if(categories_field.value.length > 0) {
		if(sectionCategories.rows[sectionCategories.rowCount-1].backgroundColor == '#CCC') {
			sectionCategories.rows[sectionCategories.rowCount-1].backgroundColor = 'blue';
			sectionCategories.rows[sectionCategories.rowCount-1].children[0].text = 'Save Changes';
		}
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
	if(!validateSymptoms()) return;	
	if(!beforeSaving()) return;
		
		deleteSymptomsForTreatmentLocal(treatment.id);
			treatment.symptoms.splice(0, treatment.symptoms.length);
			
			if(symptoms_field.value != null) {
				if(symptoms_field.value.length > 1) {
					symptoms_field.value.replace(".",",");
					var final_symptoms = symptoms_field.value.split(',');
					for(var i=0;i < final_symptoms.length;i++) {
						if(final_symptoms[i].length < 2) continue;
						final_symptoms[i] = removeWhiteSpace(final_symptoms[i]);
						insertSymptomForTreatmentLocal(treatment.id,final_symptoms[i]);
						treatment.symptoms.push(final_symptoms[i]);
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

symptoms_field.addEventListener('blur', function() {
	if(symptoms_field.value.length > 0) {
		if(sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor == '#CCC') {
			sectionSymptoms.rows[sectionSymptoms.rowCount-1].backgroundColor = 'blue';
			sectionSymptoms.rows[sectionSymptoms.rowCount-1].children[0].text = 'Save Changes';
		}
	}
});

function validateSideEffects()
{
//	if(sideEffects_field.value == null || sideEffects_field.value == '') {
//		alert('You must list at least one side effect');
//		return false;
//	}
	return true;
}


function saveSideEffects() 
{
	if(!validateSideEffects()) return;	
	if(!beforeSaving()) return;
		
		deleteSideEffectsForTreatmentLocal(treatment.id);
			treatment.sideEffects.splice(0, treatment.sideEffects.length);
			
			if(sideEffects_field.value != null) {
				if(sideEffects_field.value.length > 1) {
					sideEffects_field.value.replace(".",",");
					var final_sideEffects = sideEffects_field.value.split(',');
					for(var i=0;i < final_sideEffects.length;i++) {
						if(final_sideEffects[i].length < 2) continue;
						final_sideEffects[i] = removeWhiteSpace(final_sideEffects[i]);
						insertSideEffectForTreatmentLocal(treatment.id,final_sideEffects[i]);
						treatment.sideEffects.push(final_sideEffects[i]);
					}
				}
			}
		
		if(sectionSideEffects.rows[sectionSideEffects.rowCount-1].backgroundColor == 'blue') { 
			sectionSideEffects.rows[sectionSideEffects.rowCount-1].backgroundColor = '#CCC';
			sectionSideEffects.rows[sectionSideEffects.rowCount-1].children[0].text = 'Changes Saved!';
		}
}

sectionSideEffects.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'blue') saveSideEffects();
});

sideEffects_field.addEventListener('blur', function() {
	if(sideEffects_field.value.length > 0) {
		if(sectionSideEffects.rows[sectionSideEffects.rowCount-1].backgroundColor == '#CCC') {
			sectionSideEffects.rows[sectionSideEffects.rowCount-1].backgroundColor = 'blue';
			sectionSideEffects.rows[sectionSideEffects.rowCount-1].children[0].text = 'Save Changes';
		}
	}
});


/*
symptoms_field.addEventListener('blur', function() {
	if(symptoms_field.value.length > 0)   {
		for(var i=sectionSymptoms.rows.length-1;i > 0; i--)   {
			if(symptoms_field.value.toLowerCase() == sectionSymptoms.rows[i].children[0].value.toLowerCase())   {
				symptoms_field.value = '';
				return;
			}
		}
		new_symptom = Titanium.UI.createTextField({ value: symptoms_field.value, width: '99%', color: 'black', left: '1%' });
		
		new_symptom.addEventListener('blur', function(e) {
			if(e.value.length < 1) {
				var length = sectionSymptoms.rowCount;
				for(var i=length-1;i>0;i--) {
					if(sectionSymptoms.rows[i].children[0].value.length < 1) {	
						sectionSymptoms.remove(sectionSymptoms.rows[i]);
					}
				}
				table.data = [sectionDetails,sectionSymptoms, sectionOutcome, sectionSideEffects, sectionDelete ];
			} 
		});    
		
		sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
		sectionSymptoms.rows[sectionSymptoms.rowCount-1].add(new_symptom);
		symptoms_field.value = '';
	}
	table.data = [sectionDetails,sectionSymptoms, sectionOutcome, sectionSideEffects, sectionDelete ];
});
*/	

	return navGroupWindow;
};

module.exports = treatment;