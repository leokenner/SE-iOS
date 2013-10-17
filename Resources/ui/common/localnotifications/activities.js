

function scheduleActivityLocalNotifications(activity)
{
	Ti.App.iOS.cancelAllLocalNotifications();
					var funny = new Date();
					funny.setMinutes(funny.getMinutes() + 2);	 
						Ti.App.iOS.scheduleLocalNotification({ 
							alertBody: " needs to complete an activity", 
							alertAction: "view",  
							userInfo: {"type": "activity", }, 
							date: funny,//new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null),  
						});		
					
}