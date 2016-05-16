var rp = require('request-promise');
var fs = require('fs');
var async = require('async');
var moment = require('moment');

var getAccounts = function(sid,auth) {
	return new Promise(function(fulfill,reject){

		var accounts = []
		var accountsUrl = 'https://api.twilio.com/2010-04-01/Accounts.json?PageSize=1000'

		options = {
			json: true,
			uri: accountsUrl,
			auth: {
				user: sid,
				pass: auth
			}
		}

		rp(options)
		.then(function(response){
			for(i = 0; i < response.accounts.length; i++) {
				if(response.accounts[i].status!='closed'&&response.accounts[i].auth_token.length>0) {
					accounts.push({sid: response.accounts[i].sid, auth: response.accounts[i].auth_token, friendly_name: response.accounts[i].friendly_name});
				}
			}

			if(response.next_page_uri){
				getAccounts('https://api.twilio.com' + response.next_page_uri);
			} else {
				fulfill(accounts);
			}
			
		});

	});
}

module.exports = getAccounts;