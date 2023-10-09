[ ] make "add" on backend
[ ] test on frontend
[ ] make & test the rest

[ ] frontend: implement changing which queues are active
[ ] frontend: make the two queues side-by-side, and responsive to screen
[ ] frontend: don't display the add name button if your name is already in there
[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
