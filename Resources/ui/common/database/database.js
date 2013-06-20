var db = Titanium.Database.open('localVersion_db');
var Cloud = require('ti.cloud');

function initDBLocal()
{
	Ti.include('ui/common/database/users_db.js');
	Ti.include('ui/common/database/children_db.js');
	Ti.include('ui/common/database/relationships_db.js');
	Ti.include('ui/common/database/records_db.js');
	Ti.include('ui/common/database/incidents_db.js');
	Ti.include('ui/common/database/entries_db.js');
	Ti.include('ui/common/database/activities_db.js');
	Ti.include('ui/common/database/appointments_db.js');
	Ti.include('ui/common/database/treatments_db.js');
	
	
	db.execute('PRAGMA foreign_keys = ON');
	
	initUsersDBLocal();
	initChildrenDBLocal();
	initRelationshipsDBLocal();
	initRecordsDBLocal();
	initEntriesDBLocal();
	initActivitiesDBLocal();
	//initIncidentsDBLocal();
	initAppointmentsDBLocal();
	initTreatmentsDBLocal();
	

}


function updateTable() 
{
	var sql = [];
	sql[0] = "DROP TABLE IF EXISTS entries";
/*	sql[1] = "DROP TABLE IF EXISTS treatment_categories";
	sql[2] = "DROP TABLE IF EXISTS treatment_times";
	sql[3] = "DROP TABLE IF EXISTS appointment_symptoms";
	sql[4] = "DROP TABLE IF EXISTS appointment_doctors";
	sql[5] = "DROP TABLE IF EXISTS appointments";
	sql[6] = "DROP TABLE IF EXISTS incident_symptoms";
	sql[7] = "DROP TABLE IF EXISTS incidents";
	sql[8] = "DROP TABLE IF EXISTS records";
	sql[9] = "DROP TABLE IF EXISTS relationships";
	sql[10] = "DROP TABLE IF EXISTS children"; */
	for(var i=0;i<sql.length;i++) {
		db.execute(sql[i]);
	}
}


