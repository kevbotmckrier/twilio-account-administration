##Twilio Account Administration Scripts

###Installation


Clone repo into a local directory and use `npm install` to install dependencies.

###Pulling usage csv

Call with 
```
node generateSummaryBillCsv.js [Account SID] [Account Auth Token] [Start Date (YYYY-MM-DD)] [End Date (YYYY-MM-DD)]
```

It will generate a .csv file called Bill for [AccountSid] from [StartDate] to [EndDate] containing all of your usage from the specified time period aggregated by month for every active or suspended subaccount and your master account.

This will include Account SID, Description, Start Date and End Date (for partial months), Count, Count Unit, Usage, Usage Unit, Price,  and Price Unit.

**If you sum up everything you will get a number larger than your total usage!**

This .csv includes every possible category so there is some overlap including the totalPrice parameter.

###Pulling Twilio Phone Numbers

Call with 
```
node generatePhoneNumberCsv.js [Account SID] [Account Auth Token]
```

This will generate a .csv file called Phone Numbers for [AccountSid] containing all of your phone numbers for every subaccount.

It will include the Account SID, phone number friendly name, and phone number.

###Pulling Twilio Call Logs

Call with 
```
node pullCallLogs.js [Account SID] [Account Auth Token] [Start Date YYYY-MM-DD] [End Date YYYY-MM-DD]
```

This will generate a .csv file called Call Logs for [AccountSid] from [Start Date] to [End Date]
containing all of your call logs.

It will include the Account SID, phone number friendly name, and phone number.

###Pulling the date of the last call across subaccounts

Call with 
```
node generateLastCallCsv.js [Account SID] [Account Auth Token]
```

This will generate a .csv file called Last call forfor [AccountSid] containing a list of all your subaccounts and the date of the last call.

It will include the Account friendly name, Account SID, datetime of last call.

####Optional parameters

#####Concurrency

The default concurrency is 25, but if you want to adjust this you can pass in an additional parameter:

```
node generateSummaryBillCsv.js [Account SID] [Account Auth Token] [Start Date (YYYY-MM-DD)] [End Date (YYYY-MM-DD)] [Concurrency]
```

```
node generatePhoneNumberCsv.js [Account SID] [Account Auth Token] [Concurrency]
```

```
node pullCallLogs.js [Account SID] [Account Auth Token] [Start Date YYYY-MM-DD] [End Date YYYY-MM-DD] [Concurrency]
```

Please note that Twilio accounts have a default GET concurrency of 100.

#####Time interval

By default pullCallLogs pulls logs in 2 hour chunks. If you want to pull larger time slots you can adjust this by passing in an additional parameter with the number of minutes like so: 
```
node pullCallLogs.js [Account SID] [Account Auth Token] [Start Date YYYY-MM-DD] [End Date YYYY-MM-DD] [Concurrency] [Time Interval to pull in]
```


