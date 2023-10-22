[ ] add the ability to see the age of each request to frontend
[ ] use context for some things that we need widely (session, timediff)
[ ] frontend: don't display the add name button if your name is already in there
[ ] move this account management to its own app...

[ ] frontend: make the two queues side-by-side, and responsive to screen

[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button
[ ] maybe a "recently helped" view can help see stuff
[ ] being able to manually drag a name around / add a name myself / add a name at a specific position!?

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
