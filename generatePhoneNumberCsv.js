if(!(process.argv[2]&&process.argv[3])) {

	console.log(process.argv[2]);
	console.log("Please pass in the following variables: SID, Auth");
	process.exit(1);

}

var getAccounts = require('./getAccounts.js');
var getPhoneNumbers = require('./getPhoneNumbers.js')

//Twilio account variables
var sid = process.argv[2];
var auth = process.argv[3];

getAccounts(sid,auth)
.then(function(accounts){

	getPhoneNumbers(sid,auth,accounts);

})