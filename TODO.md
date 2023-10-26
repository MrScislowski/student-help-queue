[ ] add the ability to change the name of the queues, but keeping their ids the same. This will require changes in the data structure used by the backend, frontend, and database. Maybe rethinking the backend endpoints at this point would be a good idea.

DB:

- create a new Queue schema and type (including \_id)

backend:
currently set up as

GET /api/account/queues/active
POST /api/account/queues
POST /api/account/queues/archive
POST /api/account/queues/reactivate
POST /api/account/queues/delete

how about:
GET /api/queues/active (for student frontend)
GET /api/queues
POST /api/queues/new
POST /api/queues/:id w/ {active: true}, etc.

[ ] implement adding / archiving queues etc.

[ ] make it look better.

[ ] change the credentials for logging in to teacher-frontend, and register it differently on Google Console

[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button
[ ] maybe a "recently helped" view can help see stuff
[ ] being able to manually drag a name around / add a name myself / add a name at a specific position!?

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
