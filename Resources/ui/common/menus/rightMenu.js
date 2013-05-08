


function rightMenu()
{
	var window = Titanium.UI.createWindow({
  		title: 'Log',
  		barColor: 'blue',
  		top: 0,
  		right: 0,
  		width: 260,
  		zIndex: 1
	});
	
	var navGroupWindow = require('ui/handheld/ApplicationNavGroup');
	navGroupWindow = new navGroupWindow(window);
	
	rightMenu_table = Ti.UI.createTableView({
		backgroundColor: 'red',
		borderColor: 'black',
		rowHeight: 45
	});
	window.add(rightMenu_table);
	
	
	
	
	return navGroupWindow;
}

module.exports = rightMenu;