
/*
 * creates a new navgroup starting with the new window
 * input: new window
 * output: nav group
 */
function ApplicationNavGroup(new_window)
{
var win1 = Titanium.UI.createWindow({
	width: new_window.width,
	top: new_window.top,
	left: new_window.left,
	right: new_window.right
});

var nav = Titanium.UI.iPhone.createNavigationGroup({
   window: new_window
});

win1.add(nav);

return win1;
}

module.exports = ApplicationNavGroup;


