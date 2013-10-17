

function aboutAppointments(navGroup) {
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  title: 'About appointments',
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

var scrollView = Ti.UI.createScrollView({ width: '99%', });
var main_text = Ti.UI.createLabel({ text: "Appointments are your personal record of appointments with medical professionals regarding "+
											"your child. Please note that at the moment, entering an appointment on StarsEarth does not schedule "+
											"an actual appointment. An appointment must always be related to an individual and an entry. "+
											"For more details about entries, please see the 'About entries' part of the help section. \n\nWhen creating "+
											"an appointment, you need to give details such as the date, time and duration of the appointment. You also "+
											"need to mention the symptom(s) that the individual is suffering from and the details of the doctor you are "+
											"going to visit. \n\nOnce the appointment is created, you can view it from the Home view and the record book "+
											"of the individual the appointment was created for. There you can also edit its details and delete it if you "+
											"wish to. After the appointment is over, StarsEarth will notify you so that you can record your observations "+
											"and schedule any prescribed treatments. \n\nFor more help as to how appointments work, simply tap the title "+
											"of the appointment form.", 
											textAlign: 1, width: '90%', top: 0 });
scrollView.add(main_text);
self.add(scrollView);

	if(navGroupWindow) return navGroupWindow; 
	else return self;
};

module.exports = aboutAppointments;