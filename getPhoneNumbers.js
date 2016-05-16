var rp = require('request-promise');
var fs = require('fs');
var async = require('async');
var moment = require('moment');

var getPhoneNumbers = function(sid,auth,accounts,concurrency){

	var stream = fs.createWriteStream('Phone Numbers for ' + sid + '.csv');
	stream.write('Account SID,Account Friendly Name,Phone Number Friendly Name,Phone Number\n');

	var q = async.queue(function(task,callback){
		
		if(task.next_page_uri) {
			var uri = 'https://api.twilio.com' + task.next_page_uri
		} else {
			var uri = 'https://api.twilio.com/2010-04-01/Accounts/' + task.sid + '/IncomingPhoneNumbers.json?PageSize=1000';
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

			async.forEachOf(response.incoming_phone_numbers, function(item,key){

				stream.write(item.account_sid+','+task.friendly_name+','+item.friendly_name+','+item.phone_number+'\n');

			});
			
			if(response.next_page_uri){
				q.push({sid: task.sid, auth: task.auth, next_page_uri: response.next_page_uri, friendly_name: task.friendly_name});
			}

			callback();
		},function(err){
			console.log(options);
			console.log(err);
		});

		
	}, concurrency);

	q.drain = function() {
		// console.log('CSV complete. File saved as ' + '"Bill for ' + sid + ' from ' + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD') + '"');
		console.log('CSV complete.');
	}

	q.push(accounts);

}

module.exports = getPhoneNumbers;