var rp = require('request-promise');
var fs = require('fs');
var async = require('async');
var moment = require('moment');

var getLastCall = function(sid,auth,accounts,concurrency){

	var stream = fs.createWriteStream('Last call for ' + sid + '.csv');
	stream.write('Account Friendly Name,Account SID,Last Call Time\n');

	var q = async.queue(function(task,callback){

		var uri = 'https://api.twilio.com/2010-04-01/Accounts/' + task.sid + '/Calls.json?PageSize=1'
		
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

			async.forEachOf(response.calls, function(item,key){

				stream.write(task.friendly_name+','+task.sid+','+item.date_created+'\n');

			});


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

	console.log(accounts);
	q.push(accounts);

}

module.exports = getLastCall;