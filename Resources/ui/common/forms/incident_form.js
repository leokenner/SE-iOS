

function incident(input)
{
	Ti.include('ui/common/helpers/dateTime.js');
	Ti.include('ui/common/helpers/list.js');
	Ti.include('ui/common/database/database.js');
	
	var incident = {
		id: input.id?input.id:null,
		record_id: input.record_id?input.record_id:null,
		causes: input.causes?input.causes:null,
		date: input.date?input.date:timeFormatted(new Date).date,
		time: input.time?input.time:timeFormatted(new Date).time,
		symptoms: input.symptoms?input.symptoms:[],
	}
	
		
	var win = Ti.UI.createWindow({
		title: 'Incident',
		backgroundColor: 'white'
	});
	win.hideTabBar();
	
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(win);
	navGroupWindow.result = null;
	
	var cancel_btn = Ti.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.CANCEL
	});
	win.leftNavButton = cancel_btn;
	
	cancel_btn.addEventListener('click', function() {
		navGroupWindow.close();
	});
	
	var save_btn = Ti.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.SAVE
	});
	win.rightNavButton = save_btn;
	
	save_btn.addEventListener('click', function() {
		if(table.scrollable == false) { return; }
		if(incident.record_id == null) {
			incident.record_id = insertRecordLocal(Titanium.App.Properties.getString('child'));
			incident.id = insertIncidentLocal(incident.record_id,causes.value,incident.date,incident.time,duration.value);
			updateRecordLocal(incident.record_id,incident.id,'incident',timeFormatted(new Date()).date,timeFormatted(new Date()).time);		
		}
		else if(incident.id == null) {
			incident.id = insertIncidentLocal(incident.record_id,causes.value,incident.date,incident.time);
			updateRecordLocal(incident.record_id,Titanium.App.Properties.getString('child'),incident.id,'incident',timeFormatted(new Date()).date,timeFormatted(new Date()).time);
		}
		else {
			updateIncidentLocal(incident.id,causes.value,incident.date,incident.time,duration.value);
		}
		deleteSymptomsForIncidentLocal(incident.id);
		for(var i=1;i < sectionSymptoms.rows.length;i++) {
				insertSymptomForIncidentLocal(incident.id,sectionSymptoms.rows[i].children[0].value);
				incident.symptoms.push(sectionSymptoms.rows[i].children[0].value);
		}
		incident.causes = causes.value;
		incident.duration = duration.value;
		navGroupWindow.result = incident;
		navGroupWindow.close();
	});
	
	
	var table = Ti.UI.createTableView({
		style: 1,
		rowHeight: 45,
	});
	
	var sectionMain = Ti.UI.createTableViewSection();
	sectionMain.add(Ti.UI.createTableViewRow({ title: 'Causes', height: 160 }));
	//sectionMain.add(Ti.UI.createTableViewRow({ title: 'Date/Time' }));
	//sectionMain.add(Ti.UI.createTableViewRow({ title: 'Duration' }));
	
	
	//var causes = Titanium.UI.createTextField({ hintText: 'eg: seizure, panick attack', value: incident.causes, width: '65%', left: '35%' });
	var causes = Titanium.UI.createTextArea({ width: '100%', top: 5, font: { fontSize: 17 }, height: 140, borderRadius: 10 });
	var dateTime = Titanium.UI.createLabel({ text: incident.date+' '+incident.time, width: '50%', left: '35%' });
	var duration = Titanium.UI.createTextField({ hintText: 'eg: 30 mins', value: input.duration, width: '65%', left: '35%' });
	sectionMain.rows[0].add(causes);
	//sectionMain.rows[1].add(dateTime);
	//sectionMain.rows[2].add(duration);
	
	
	var sectionSymptoms = Ti.UI.createTableViewSection({ headerTitle: 'Symptoms' });
	sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
	var symptoms_field = Titanium.UI.createTextField({ hintText: 'List symptoms here, one per line', leftButtonPadding: 5, width: '99%', color: 'black', left: '1%' });
	sectionSymptoms.rows[0].add(symptoms_field);
	var new_symptom;
	
	for(var i=0;i < incident.symptoms.length; i++) {
		new_symptom = Titanium.UI.createTextField({ value: incident.symptoms[i], width: '99%', color: 'black', left: '1%' });
		
		new_symptom.addEventListener('blur', function(e) {
			if(e.value.length < 1)  {
				var length = sectionSymptoms.rowCount;
				for(var i=length-1;i>0;i--)  {
					if(sectionSymptoms.rows[i].children[0].value.length < 1)   {	
						sectionSymptoms.remove(sectionSymptoms.rows[i]);
					}
				}
				table.data = [sectionMain,sectionSymptoms];
			}
		});
		
		sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
		sectionSymptoms.rows[sectionSymptoms.rowCount-1].add(new_symptom);
	}
	
	
	
	var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Additional information' });
	sectionDetails.add(Ti.UI.createTableViewRow({ height: 135, width: '100%' }));
	var details = Ti.UI.createTextArea({ hintText: 'Enter here', height: 135, left: 0 });
	sectionDetails.rows[0].add(details);
	
	table.data = [sectionMain,sectionSymptoms];
	
	win.add(table);
	

dateTime.addEventListener('click', function(e) {
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,'incident',dateTime.text); 

	if(win.leftNavButton != null) { 
		win.leftNavButton.setTouchEnabled(false);
	}
	win.rightNavButton.setTouchEnabled(false); 
	win.setTouchEnabled(false);
	table.scrollable = false;

	modalPicker.open();


	modalPicker.addEventListener('close', function() {
		var newDate = timeFormatted(modalPicker.result);
		incident.date = newDate.date;
		incident.time = newDate.time;
		dateTime.text = newDate.date+' '+newDate.time;
		win.setTouchEnabled(true);
		if(win.leftNavButton != null) { 
			win.leftNavButton.setTouchEnabled(true);
		}
		win.rightNavButton.setTouchEnabled(true); 
		table.scrollable = true;
	});
});



symptoms_field.addEventListener('blur', function() {
	if(symptoms_field.value.length > 0)
	{
		for(var i=sectionSymptoms.rows.length-1;i > 0; i--)  {
			if(symptoms_field.value.toLowerCase() === sectionSymptoms.rows[i].children[0].value.toLowerCase())   {
				symptoms_field.value = '';
				return;
			}
		}
		new_symptom = Titanium.UI.createTextField({ value: symptoms_field.value, width: '99%', color: 'black', left: '1%' });
		
		new_symptom.addEventListener('blur', function(e) {
			if(e.value.length < 1)
			{
				var length = sectionSymptoms.rowCount;
				for(var i=length-1;i>0;i--)
				{
					if(sectionSymptoms.rows[i].children[0].value.length < 1)
					{	
						sectionSymptoms.remove(sectionSymptoms.rows[i]);
					}
				}
				table.data = [sectionMain,sectionSymptoms];
			}
		});
		
		sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
		sectionSymptoms.rows[sectionSymptoms.rowCount-1].add(new_symptom);
		symptoms_field.value = '';
	}
	table.data = [sectionMain,sectionSymptoms];
});
	
	



return navGroupWindow;	
	
}

module.exports = incident;
