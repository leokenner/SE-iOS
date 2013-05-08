


function treatmentView(input) {
	
	var table = Ti.UI.createTableView({
		borderColor: 'black',
		height: 60,
	});
	
	
	
	var view = Ti.UI.createView({
		backgroundColor: '#0EE9E9',
		borderColor: 'black',
		height: 130,
		width: '100%'
	});
	
	
	var treatment_header = Ti.UI.createLabel({ 
		text: input.medication?input.medication:'No medication recorded', 
		textAlign: 0,
		left: 5,
		//backgroundColor: 'red',
		//borderColor: 'black',
		font: { fontSize: 18 },
		color: 'black',
		width: '100%',
		height: 40,
		top: 0
	});
	
	var line = Ti.UI.createView({ width: '80%', height: 1, top: 40, left: 0, borderColor: 'black' });
	
	var start_date = Ti.UI.createLabel({
		text: 'From '+input.start_date,
		textAlign: 1,
		font: { fontSize: 18, fontWeight: 'bold' },
		top: 45,
		width: '100%'
	});
	
	var end_date = Ti.UI.createLabel({
		text: 'To '+input.end_date,
		textAlign: 1,
		font: { fontSize: 18, fontWeight: 'bold' },
		top: 65,
		width: '100%'
	});

	view.add(treatment_header);
	view.add(line);
	view.add(start_date);
	view.add(end_date);
	
	var resultView = Ti.UI.createView({
		height: 35,
		bottom: 0,
		width: '100%',
		borderColor: 'black',
		//backgroundColor: 'white'
	});
	
	view.add(resultView);
	
	view.addEventListener('click', function() {
		var treatment = require('ui/common/forms/treatment_form');
		treatment = new treatment(input);
		//var navGroup = require('ui/handheld/ApplicationNavGroup');
		//navGroup = new navGroup(treatment);
		//navGroup.open();
		treatment.open();
		
		treatment.addEventListener('close', function() {
			//navGroup.close();
			if(treatment.result != null)
			{
				input = treatment.result;
				treatment_header.text = input.medication?input.medication:'No medication recorded';
				start_date.text = 'From '+input.start_date;
				end_date.text = 'To '+input.end_date;
			}
		});
	});

	
	return view;
	
}

module.exports = treatmentView;
