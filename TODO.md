[ ] make on backend then test using frontend for:

- archive a queue... let's list all the archived queues at the bottom, and you can delete / re-institute them from there.
  [x] add backend code to archive a queue
  [x] list all the archived code at the bottom, below the queues
  [x] add a button or something to archive the queue
- unarchive a queue
  [x] add backend code to unarchive a queue
  [ ] add frontend code to unarchive a queue
- delete a queue

[ ] frontend: implement changing which queues are active
[ ] frontend: make the two queues side-by-side, and responsive to screen
[ ] frontend: don't display the add name button if your name is already in there
[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
