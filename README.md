##Pull Twilio Usage CSV

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

#Optional parameter

The default concurrency is 25, but if you want to adjust this you can pass in a 5th parameter:

```
node generateSummaryBillCsv.js [Account SID] [Account Auth Token] [Start Date (YYYY-MM-DD)] [End Date (YYYY-MM-DD)] [Concurrency]
```

Please note that Twilio accounts have a default GET concurrency of 100.