[ ] parseSession isn't getting what it wanted..., probably need to fix something on frontend (make sure the token actually contains the whole session not just the user also...)
[ ] add querying abilities back into frontend
[ ] move this account management to its own app...

[ ] frontend: make the two queues side-by-side, and responsive to screen

[ ] frontend: don't display the add name button if your name is already in there
[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button
[ ] maybe a "recently helped" view can help see stuff
[ ] being able to manually drag a name around / add a name myself / add a name at a specific position!?

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
