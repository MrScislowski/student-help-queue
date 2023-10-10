[ ] refactor frontend code so that it's not so ugly
[ ] use tanstack query for the account queries also
[ ] frontend: make the two queues side-by-side, and responsive to screen
[ ] move this account management to its own app...

[ ] frontend: don't display the add name button if your name is already in there
[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
