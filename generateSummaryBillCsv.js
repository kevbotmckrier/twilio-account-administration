if(!(process.argv[2]&&process.argv[3]&&process.argv[4]&&process.argv[5])) {

	console.log(process.argv[2]);
	console.log("Please pass in the following variables: SID, Auth, Start Date, End Date");
	process.exit(1);

}

var moment = require('moment');
var getAccounts = require('./getAccounts.js');
var getBillings = require('./getBillings.js');

//Twilio account variables
var sid = process.argv[2];
var auth = process.argv[3];

//Start and end date.
var startDate = moment(process.argv[4], 'YYYY-MM-DD');
var endDate = moment(process.argv[5], 'YYYY-MM-DD');

if(process.argv[6]) {
	var concurrency = process.argv[6];
} else {
	var concurrency = 25;
}

getAccounts(sid,auth)
.then(function(accounts){
	getBillings(sid,auth,startDate,endDate,accounts,concurrency);
});