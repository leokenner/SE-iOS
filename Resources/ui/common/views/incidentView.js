


function incidentView(input) {
	
	var view = Ti.UI.createView({
		backgroundColor: 'white',
		borderColor: 'black',
		height: 200,
		width: '100%'
	});
	
	
	var causes = Ti.UI.createLabel({ 
		text: input.causes?input.causes:'Incident', 
		left: 5,
		font: { fontSize: 20 },
		color: 'black',
		height: 45,
		top: 0
	});
	
	var top_line = Ti.UI.createView({ height: 1, width: '80%', left: 0, top: 45, backgroundColor: 'blue', borderColor: 'black' });
	
	var date = Ti.UI.createLabel({
		text: input.date,
		textAlign: 1,
		font: { fontSize: 30, fontWeight: 'bold' },
		top: 70,
		width: '100%'
	});
	
	var time = Ti.UI.createLabel({
		text: input.time,
		textAlign: 1,
		font: { fontSize: 25, fontWeight: 'bold' },
		top: 105,
		width: '100%'
	});

	view.add(causes);
	view.add(top_line);
	view.add(date);
	view.add(time);
	
	
	view.addEventListener('click', function() {
		var incident = require('ui/common/forms/incident_form');
		incidentWindow = new incident(input);
		incidentWindow.open();
		
		incidentWindow.addEventListener('close', function() {
			if(incidentWindow.result != null)
			{
				input = incidentWindow.result;
				causes.text = input.causes?input.causes:'Incident';
				date.text = input.date;
				time.text = input.time;
			}
		});
	});

	
	return view;
	
}

module.exports = incidentView;
