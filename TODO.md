[ ] the entries object I'm seeing in the network tab of the browser has two \_ids... one at the top level of the activeEntry object (this seems good), but then one inside every request.user{} object. And they're unique even if the user is the same. No bueno. In fact, I think I'd like to refactor the ActiveEntry model so that it doesn't have "request". That may mean the types are less inheritable, but I think that's the better trade-off
[ ] frontend: don't display the add name button if your name is already in there
[ ] move this account management to its own app...

[ ] frontend: make the two queues side-by-side, and responsive to screen

[ ] maybe display the most recently removed name for just a minute, so that if I incorrectly remove someone, I can get back to it. Maybe via a notifier with an "undo" button
[ ] maybe a "recently helped" view can help see stuff
[ ] being able to manually drag a name around / add a name myself / add a name at a specific position!?

[ ] run this on the actual production db:
db.archiveds.updateMany({queueName: {$exists: false}}, {$set: {queueName: "help"}} )
