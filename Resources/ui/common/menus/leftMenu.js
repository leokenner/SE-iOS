


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
	
	
	var sectionChildren = Ti.UI.createTableViewSection({ headerTitle: 'Patients' });	
	var sectionOther = Ti.UI.createTableViewSection({ headerTitle: ' ' });
	var logout_row = Ti.UI.createTableViewRow({ title: 'Logout', color: 'white', });
	sectionOther.add(logout_row);
	leftMenu_table.data = [sectionChildren, sectionOther];
	window.add(leftMenu_table);
	

function insertChildren()
{
	var children = getAllChildrenLocal();
	var tableViewRow = [];
	
	sectionChildren = Ti.UI.createTableViewSection({ headerTitle: 'Patients' });
	
    	for(var i=0;i<children.length;i++)
    	{    
    		var child = children[i];		
    		tableViewRow[i] = Ti.UI.createTableViewRow({ color: 'white', });	
        	tableViewRow[i].title = child.first_name+' '+child.last_name;
        	tableViewRow[i].child_id = child.id;
        	tableViewRow[i].addEventListener('click', function(e) {
        		Titanium.App.Properties.setString('child', e.rowData.child_id); 
        		Ti.App.fireEvent('changeUser'); 
        		});      	
            sectionChildren.add(tableViewRow[i]); 
        }
        var row = Ti.UI.createTableViewRow({ title: 'Start New Record', color: 'white' });
        row.addEventListener('click', function() {
        	if(!Titanium.Network.online) { 
        		alert('You are not connected to the internet. New child profile cannot be created');
        		return;
        	}
        	var row_id = insertChildLocal(Titanium.App.Properties.getString('user'), 'New','Child',null,null,null);
        	createObjectACS('children', { id: row_id, user_id: Titanium.App.Properties.getString('user'), first_name: 'New', last_name: 'Child', });
        	Titanium.App.Properties.setString('child', row_id);
        	Ti.App.fireEvent('changeUser');
        });
        sectionChildren.add(row);  	
        leftMenu_table.data = [sectionChildren,sectionOther];
}

logout_row.addEventListener('click', function() {	
	logout();
	activityIndicator.show();
});

Ti.App.addEventListener('logoutClicked', function() {
	activityIndicator.hide();
});

Ti.App.addEventListener('showMenu', function() {
		insertChildren();
	});
	
	
	return navGroupWindow;
}

module.exports = leftMenu;