

function individual(navGroupWindow)
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	
	var users = getUserLocal(Titanium.App.Properties.getString('user'));
	var user = users[0]; 
	
	var self = require('ui/common/bootcamp/bootCampWindow');
		self = new self('Open Record Book', navGroupWindow);
	var navGroup = (navGroupWindow.getChildren())[0];
	
	
	var scrollView = Ti.UI.createScrollView({ layout: 'vertical' });
	self.add(scrollView);
	
	var text = Ti.UI.createLabel({ textAlign: 'center', width:  280, top: 20, font: { fontSize: 14 } });
	text.text = "You will use StarsEarth to maintain records for individuals. These records are maintained "+
				"in StarsEarth record books. These record books can then be accessed at any time from the main "+
				"menu.\n\n To open your first record book, enter an individual's name below (eg: your child/relative/patient) and tap next.";
				
	scrollView.add(text);
	
	var first_name = Ti.UI.createTextField({ paddingLeft: 5, hintText: 'First name', height: 40, top: 20, width: 200, borderColor: '#999999' });
	var last_name = Ti.UI.createTextField({ paddingLeft: 5, hintText: 'Last name', height: 40, top: 10, width: 200, borderColor: '#999999' });
	scrollView.add(first_name);
	scrollView.add(last_name);
	
	var next_btn = Ti.UI.createView({ width: 200, height: 50, top: 20, backgroundColor: 'blue' });
	var next_txt = Ti.UI.createLabel({ color: 'white', text: 'Next' });
	next_btn.add(next_txt);
	scrollView.add(next_btn);			
	
	next_btn.addEventListener('click', function() {
		var fname,lname = false;
		var onlyLetters = /^[a-zA-Z]*$/.test(first_name.value);
		if(first_name.value != null && first_name.value.length > 1 && onlyLetters) { fname = true; }
		else { alert('First name must be longer than one character and contain only letters'); }
		onlyLetters = /^[a-zA-Z]*$/.test(last_name.value);
		if(last_name.value != null && last_name.value.length > 1 && onlyLetters) { lname = true; }	
		else { alert('Last name must be longer than one character and contain only letters'); }
		if(!fname || !lname) return;
		
		var row_id = insertChildLocal(Titanium.App.Properties.getString('user'), first_name.value,last_name.value,null,null,null);
		insertRelationshipLocal(row_id, Titanium.App.Properties.getString('user'), 'Relation Unknown: Tap to change');
		var child = getChildLocal(row_id);
		child[0].user_id = getUserLocal(Titanium.App.Properties.getString('user'))[0].cloud_id;
		createObjectACS('children', child[0]);
		
		var next = require('ui/common/bootcamp/entry');
			next = new next(navGroupWindow);
		navGroup.open(next);
	});
	
	return self;
}

module.exports = individual;
