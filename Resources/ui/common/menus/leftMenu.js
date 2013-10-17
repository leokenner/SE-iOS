


function leftMenu()
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	
	var users = getUserLocal(Titanium.App.Properties.getString('user'));
	var parent = {
		id: users[0].id,
		first_name: users[0].first_name,
		last_name: users[0].last_name,
		email: users[0].email
	}
	
	var window = Titanium.UI.createWindow({
  		title: parent.first_name+' '+parent.last_name,
  		barColor: 'black',
  		top: 0,
  		left: 0,
  		width: 260,
  		zIndex: 1
	});
	
	var style;
	if (Ti.Platform.name === 'iPhone OS'){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else {
	  style = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	}
	var activityIndicator = Ti.UI.createActivityIndicator({
	  color: '#CCC',
	  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	  message: 'Loading...',
	  style:style,
	  top:30,
	  left: 10,
	  height:Ti.UI.SIZE,
	  width:Ti.UI.SIZE
	});
	
	// The activity indicator must be added to a window or view for it to appear
	window.add(activityIndicator);	
	
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(window);
	
	leftMenu_table = Ti.UI.createTableView({
		backgroundColor: 'black',
		borderColor: '#CCC',
		rowHeight: 45
	});
	
	var sectionHome = Ti.UI.createTableViewSection();
	sectionHome.add(Ti.UI.createTableViewRow());
	var home_title = Titanium.UI.createLabel({ color: 'white', text: 'Home', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	sectionHome.rows[0].add(home_title);
	
	var sectionRecordBooks = Ti.UI.createTableViewSection({ headerTitle: 'Record Books' });
	var sectionNewRecordBook = Ti.UI.createTableViewSection({ headerTitle: 'New Record Book' });
	sectionNewRecordBook.add(Ti.UI.createTableViewRow());
	sectionNewRecordBook.add(Ti.UI.createTableViewRow());
	sectionNewRecordBook.add(Ti.UI.createTableViewRow());	
	var new_record_book_description = Ti.UI.createLabel({ text: 'If you would like to open a new record book for an individual, '+
																'please enter their name here and press Create Record Book', textAlign: 1, color: 'white', width: '90%', });		
	var first_name = Ti.UI.createTextField({ hintText: 'First name', width: '90%', left: 5, color: 'white', });
	var last_name = Ti.UI.createTextField({ hintText: 'Last name', width: '90%', left: 5, color: 'white', });	
	var create_txt = Ti.UI.createLabel({ text: 'Create Record Book', color: 'black', });
	sectionNewRecordBook.rows[0].add(new_record_book_description);
	sectionNewRecordBook.rows[1].add(first_name);
	sectionNewRecordBook.rows[2].add(last_name);
	sectionNewRecordBook.add(Ti.UI.createTableViewRow({ backgroundColor: 'green', }));
	sectionNewRecordBook.rows[sectionNewRecordBook.rowCount-1].add(create_txt);
	var sectionOther = Ti.UI.createTableViewSection({ headerTitle: ' ' });
	var help_row = Ti.UI.createTableViewRow({ title: 'Help Questions', color: 'white', bubbleParent: false });
	var logout_row = Ti.UI.createTableViewRow({ title: 'Logout', color: 'white', bubbleParent: false });
	sectionOther.add(help_row);
	sectionOther.add(logout_row);
	leftMenu_table.data = [sectionHome, sectionRecordBooks, sectionNewRecordBook, sectionOther];
	window.add(leftMenu_table);
	insertChildren();

function insertChildren()
{
	var children = getAllChildrenLocal();
	var tableViewRow = [];
	
	sectionRecordBooks = Ti.UI.createTableViewSection({ headerTitle: 'Record Books' });
	
    	for(var i=0;i<children.length;i++)
    	{    
    		var child = children[i];		
    		tableViewRow[i] = Ti.UI.createTableViewRow();	
        	var title = Titanium.UI.createLabel({ color: 'white', text: child.first_name+' '+child.last_name, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
        	tableViewRow[i].add(title);
        	tableViewRow[i].object = child;  	
            sectionRecordBooks.add(tableViewRow[i]); 
        }
        leftMenu_table.data = [sectionHome, sectionRecordBooks, sectionNewRecordBook, sectionOther];
}

help_row.addEventListener('click', function() {
	Ti.App.fireEvent('helpSection');
});

logout_row.addEventListener('click', function() {	
	logout();
	activityIndicator.show();
});

Ti.App.addEventListener('logoutClicked', function() {
	activityIndicator.hide();
});

Ti.App.addEventListener('individualEdited', function() {
	insertChildren();
});

Ti.App.addEventListener('showMenu', function() {
	navGroupWindow.show();
});

Ti.App.addEventListener('showLog', function() {
	if(Titanium.Platform.osname == 'iphone') navGroupWindow.hide();
});

function newIndividual() {
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
		
		var row = Ti.UI.createTableViewRow();
		var title = Titanium.UI.createLabel({ color: 'white', text: first_name.value+' '+last_name.value, left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
		row.add(title);
		row.object = child[0];
		leftMenu_table.insertRowAfter(sectionRecordBooks.rowCount-1, row, {animated: true });
		
		first_name.value = '';
		last_name.value = '';
}

leftMenu_table.addEventListener('click', function(e) {
	if(e.row.backgroundColor == 'green') {
		newIndividual();
		return;
	}
	
	//If Home was clicked
	if(e.index == 0) {
		Titanium.App.Properties.setString('child', null);
		Ti.App.fireEvent('changeUser');
		return;
	}
	
	if(e.row.object) { 
		Titanium.App.Properties.setString('child', e.row.object.id); 
    	Ti.App.fireEvent('changeUser');
    }
});
	
	
	return navGroupWindow;
}

module.exports = leftMenu;