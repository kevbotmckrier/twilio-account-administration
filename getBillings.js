var rp = require('request-promise');
var fs = require('fs');
var async = require('async');
var moment = require('moment');

var getBillings = function(sid,auth,startDate,endDate,accounts,concurrency){

	var stream = fs.createWriteStream('Bill for ' + sid + ' from ' + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD')+'.csv');
	stream.write('Account SID,Account Friendly Name,Description,Start Date,End Date,Count,Count Unit,Usage,Usage Unit,Price, Price Unit\n');

	console.log('1');

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

					stream.write(item.account_sid+','+task.friendly_name+','+item.description+','+item.start_date+','+item.end_date+','+item.count+','+item.count_unit+','+item.usage+','+item.usage_unit+','+item.price+','+item.price_unit+'\n');
				
				}

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
		console.log('CSV complete. File saved as ' + '"Bill for ' + sid + ' from ' + startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD') + '"');
	}

	q.push(accounts);

}

module.exports = getBillings;