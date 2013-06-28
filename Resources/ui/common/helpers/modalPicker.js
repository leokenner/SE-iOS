

function iphoneModalPicker(type,data,selected) 
{ 
	Ti.include('ui/common/helpers/dateTime.js');

//set the selected indexes if the picker type is not date/time
if(type == null) { 
	for(var i=0;i<data.length;i++) {
		if(data[i] == selected) { var index=i; }
	}
}


var self = Titanium.UI.createTabGroup({
	top: Titanium.Platform.displayCaps.platformHeight*0.9
});
self.result = null;

var win = Titanium.UI.createWindow({
  	backgroundColor: 'black',
  });    
  
var tab1 = Titanium.UI.createTab({
	window: win
}); 
self.addTab(tab1);

var cancel_btn = Titanium.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.CANCEL,
});
cancel_btn.addEventListener('click', function() {
	self.close();
});
win.leftNavButton = cancel_btn;

var done_btn = Titanium.UI.createButton({
    systemButton: Ti.UI.iPhone.SystemButton.DONE
});
done_btn.addEventListener('click', function() {
	if(type == 'picker_columns') { self.result = picker.getSelectedRow(0).title + ' '+picker.getSelectedRow(1).title; }
	else if(type == Ti.UI.PICKER_TYPE_DATE_AND_TIME) { self.result = picker.getValue(); }
	else if(type == Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER) { self.result = picker.getCountDownDuration(); }
	else if(type == Ti.UI.PICKER_TYPE_DATE) { self.result = picker.getValue(); }
	else if(type == Ti.UI.PICKER_TYPE_TIME) { self.result = picker.getValue(); }
	else { self.result = picker.getSelectedRow(0).title; }
	self.animate(Ti.UI.createAnimation({
		top: Titanium.Platform.displayCaps.platformHeight*0.9,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
		duration: 500
		}));
	self.close();
});
win.rightNavButton = done_btn;
win.hideTabBar();


if(type == null) 
{ 
	var picker = Ti.UI.createPicker();
	for(var i=0;i<data.length;i++) {
	picker.add(Ti.UI.createPickerRow({ title: data[i] }));
	  if(data[i] == selected) {
	  	picker.setSelectedRow(0,i,false);
	  }
	}
}
else if(type == 'picker_columns')
{
	var picker_columns = [];
	
	for(var i=0;i<data.length;i++)
	{
		picker_columns[i] = Ti.UI.createPickerColumn();
		
		for(var j=0;j<data[i].length;j++)  //location 0 is the column title
		{
			if(typeof(data[i][j]) == 'number') { data[i][j] = data[i][j].toString(); }
			picker_columns[i].addRow(Ti.UI.createPickerRow({ title: data[i][j] }));
		}
	} 
	
	var picker = Ti.UI.createPicker({
     columns: picker_columns,
     selectionIndicator: true,
     useSpinner: true, // required in order to use multi-column pickers with Android
     top:50
	});
	for(var i=0;i < data.length;i++) { picker.setSelectedRow(i, 0, false); }
}
else 
{
	var d = roundMinutes(new Date());
		
		//Its a DOB picker or entry date picker......has to be in the present/past
		if(data == 'DOB') {
			var min_date = new Date(d.getFullYear()-99,00,01);
			var max_date = new Date(d.getFullYear(),d.getMonth(),d.getDate());
			var value = new Date(selected); 
		}
		else if(data == 'entry') {
			var min_date = new Date(d.getFullYear()-18,00,01,d.getHours(),d.getMinutes(),null,null);
			var max_date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null);
			var value = new Date(selected);
		}
		else if(type == Ti.UI.PICKER_TYPE_TIME && data != 'DOB' && data != 'incident') {
			var min_date = new Date(d.getFullYear(),d.getMonth(),d.getDate()-1,d.getHours(),d.getMinutes(),null,null);;
			var max_date = new Date(d.getFullYear()+2,12,31,d.getHours(),d.getMinutes(),null,null);
			var this_date = timeFormatted(new Date()).date;
			var value = roundMinutes(new Date(this_date+' '+selected));
		} 
		//Its a regular date/time picker
		else {
			var min_date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null);;
			var max_date = new Date(d.getFullYear()+2,12,31,d.getHours(),d.getMinutes(),null,null);
  			var value = roundMinutes(new Date(selected));										
		}
  		
  		var picker = Titanium.UI.createPicker({ type: type, 
  													  minDate: min_date,
  													  maxDate: max_date, 
  													  value: value,
  													  minuteInterval: 5, });	
  													  
  		if(type == Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER) picker.setCountDownDuration(selected);											  										 
  													  
  		picker.addEventListener('change',function(e) {
    		picker.setValue(e.value);
		});

}

picker.selectionIndicator = true;
win.add(picker);

self.animate(Ti.UI.createAnimation({
	top: Titanium.Platform.displayCaps.platformHeight*0.4,
	curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
	duration: 500
	}));

return self;

}


function ipadModalPicker(type, data, selected)
{
	Ti.include('ui/common/helpers/dateTime.js');

	//set the selected indexes if the picker type is not date/time
	if(type == null) { 
		for(var i=0;i<data.length;i++) {
			if(data[i] == selected) { var index=i; }
		}
	}
	
	var picker_cancelled = function() {
		popover.hide();
	}
	
	var leftButton = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.CANCEL, });
	leftButton.addEventListener('click', picker_cancelled);
	
	
	var rightButton = Ti.UI.createButton({ systemButton: Titanium.UI.iPhone.SystemButton.DONE, });
	rightButton.addEventListener('click', function(e){
		if(type == 'picker_columns') { popover.result = picker.getSelectedRow(0).title + ' '+picker.getSelectedRow(1).title; }
		else if(type == Ti.UI.PICKER_TYPE_DATE_AND_TIME) { popover.result = picker.getValue(); }
		else if(type == Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER) { popover.result = picker.getCountDownDuration(); }
		else if(type == Ti.UI.PICKER_TYPE_DATE) { popover.result = picker.getValue(); }
		else { popover.result = picker.getSelectedRow(0).title; }
	    popover.hide();
	});
	
	if(type == null) 
	{ 
		var picker = Ti.UI.createPicker();
		for(var i=0;i<data.length;i++) {
		picker.add(Ti.UI.createPickerRow({ title: data[i] }));
		  if(data[i] == selected) {
		  	picker.setSelectedRow(0,i,false);
		  }
		}
	}
	else if(type == 'picker_columns')
	{
		var picker_columns = [];
		
		for(var i=0;i<data.length;i++)
		{
			picker_columns[i] = Ti.UI.createPickerColumn();
			
			for(var j=0;j<data[i].length;j++)  //location 0 is the column title
			{
				if(typeof(data[i][j]) == 'number') { data[i][j] = data[i][j].toString(); }
				picker_columns[i].addRow(Ti.UI.createPickerRow({ title: data[i][j] }));
			}
		} 
		
		var picker = Ti.UI.createPicker({
	     columns: picker_columns,
	     selectionIndicator: true,
	     useSpinner: true, // required in order to use multi-column pickers with Android
	     top:50
		});
		for(var i=0;i < data.length;i++) { picker.setSelectedRow(i, 0, false); }
	}
	else 
	{
		var d = roundMinutes(new Date());
			
			//Its a DOB picker or incident date picker......has to be in the present/past
			if(data == 'DOB') {
				var min_date = new Date(d.getFullYear()-99,00,01);
				var max_date = new Date(d.getFullYear(),d.getMonth(),d.getDate());
				var value = new Date(selected); 
			}
			else if(data == 'incident') {
				var min_date = new Date(d.getFullYear()-18,00,01,d.getHours(),d.getMinutes(),null,null);
				var max_date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null);
				var value = new Date(selected);
			}
			else if(type == Ti.UI.PICKER_TYPE_TIME && data != 'DOB' && data != 'incident') {
				var min_date = new Date(d.getFullYear(),d.getMonth(),d.getDate()-1,d.getHours(),d.getMinutes(),null,null);;
				var max_date = new Date(d.getFullYear()+2,12,31,d.getHours(),d.getMinutes(),null,null);
				var this_date = timeFormatted(new Date()).date;
				var value = roundMinutes(new Date(this_date+' '+selected));
			}
			//Its a regular date/time picker
			else {
				var min_date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null);;
				var max_date = new Date(d.getFullYear()+2,12,31,d.getHours(),d.getMinutes(),null,null);
	  			var value = roundMinutes(new Date(selected));										
			}
	  		
	  		var picker = Titanium.UI.createPicker({ type: type, 
	  													  minDate: min_date,
	  													  maxDate: max_date, 
	  													  value: value,
	  													  minuteInterval: 5 });
	  													  
	  		if(type == Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER) picker.setCountDownDuration(selected);											  											 
	  													  
	  		picker.addEventListener('change',function(e) {
	    		picker.setValue(e.value);
			});
	}
	picker.selectionIndicator = true;
	
	var popover = Ti.UI.iPad.createPopover({
	    width: 320,
	    height: 260,
	    rightNavButton: rightButton,
	    leftNavButton: leftButton,
	});
	popover.result = null;
	popover.add(picker);
	
	popover.addEventListener('hide', picker_cancelled);
	
	return popover;
}

function modalPicker(type,data,selected)
{
	if(Titanium.Platform.osname == 'iphone')
	{
		return iphoneModalPicker(type,data,selected);
	}
	else if(Titanium.Platform.osname == 'ipad')
	{
		return ipadModalPicker(type,data,selected);
	}
}

module.exports = modalPicker;