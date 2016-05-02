if(!(process.argv[2]&&process.argv[3]&&process.argv[4]&&process.argv[5])) {

	console.log(process.argv[2]);
	console.log("Please pass in the following variables: SID, Auth, Start Date, End Date");
	process.exit(1);

}

var rp = require('request-promise');
var fs = require('fs');
var async = require('async');
var moment = require('moment');

//Twilio account variables
var sid = process.argv[2];
var auth = process.argv[3];

//Start and end date.
var startDate = moment(process.argv[4], 'YYYY-MM-DD');
var endDate = moment(process.argv[5], 'YYYY-MM-DD');

var stream = fs.createWriteStream('Bill for ' + sid + ' from ' + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD')+'.csv');
stream.write('Account SID,Description,Start Date,End Date,Count,Count Unit,Usage,Usage Unit,Price, Price Unit\n');

var accountsUrl = 'https://api.twilio.com/2010-04-01/Accounts.json?PageSize=1000'
var accounts = [];

getAccounts(accountsUrl);

function getAccounts(uri) {

	options = {
		json: true,
		uri: uri,
		auth: {
			user: sid,
			pass: auth
		}
	}

	rp(options)
	.then(function(response){
		for(i = 0; i < response.accounts.length; i++) {
			if(response.accounts[i].status!='closed'&&response.accounts[i].auth_token.length>0) {
				accounts.push({sid: response.accounts[i].sid, auth: response.accounts[i].auth_token});
			}
		}

		if(response.next_page_uri){
			getAccounts('https://api.twilio.com' + response.next_page_uri);
		} else {
			getBillings(accounts);
		}
		
	});

}

function getBillings(accounts){

	var q = async.queue(function(task,callback){
		
		if(task.next_page_uri) {
			var uri = 'https://api.twilio.com' + task.next_page_uri
		} else {
			var uri = 'https://api.twilio.com/2010-04-01/Accounts/' + task.sid + '/Usage/Records/Monthly.json?PageSize=1000&StartDate=' + startDate.format('YYYY-MM-DD') +'&EndDate=' + endDate.format('YYYY-MM-DD');
		}
		options = {
			json: true,
			uri: uri,
			auth: {
				user: sid,
				pass: auth
			}
		}

		rp(options)
		.then(function(response){

			async.forEachOf(response.usage_records, function(item,key){

				if(item.count>0||item.usage>0||item.price>0){

					stream.write(item.account_sid+','+item.description+','+item.start_date+','+item.end_date+','+item.count+','+item.count_unit+','+item.usage+','+item.usage_unit+','+item.price+','+item.price_unit+'\n');
				
				} 

			});
			
			if(response.next_page_uri){
				q.push({sid: task.sid, auth: task.auth, next_page_uri: response.next_page_uri});
			}

			callback();
		},function(err){
			console.log(options);
			console.log(err);
		});

		
	}, 10);

	q.drain = function() {
		console.log('CSV complete. File saved as ' + '"Bill for ' + sid + ' from ' + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD') + '"');
	}

	q.push(accounts);

}