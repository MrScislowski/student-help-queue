[ ] add the ability to change the name of the queues, but keeping their ids the same. This will require changes in the data structure used by the backend, frontend, and database. Maybe rethinking the backend endpoints at this point would be a good idea.

[ ] implement adding / archiving queues etc.

[ ] make it look better.

[ ] brainstorm teacher frontend views...

- I think I should use all the same endpoints (when possible) as the student-facing queue
- maybe just make it look pretty much the same, but include the ability to show / hide queues, and change their names
- that will require a change in the DB etc, because queues should become objects with permanent ids, but their displayname etc can change
- let's implement all that, then worry about how the display looks. When I'm ready to make it look fancy, use that as an excuse to learn tailwind css.

[ ] frontend: make the two queues side-by-side, and responsive to screen

[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button
[ ] maybe a "recently helped" view can help see stuff
[ ] being able to manually drag a name around / add a name myself / add a name at a specific position!?

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
