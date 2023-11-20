- [ ] add the ability to add / rename / hide queues
- [x] implement a database filling command that will clear the dbs and allow for quick testing when changing schemas
- [x] fill accounts
- [x] implement this new data structure:
- [x] fill queues, and some entries

- [ ] implement getQueues controller and service. Controller checks authorization, then dispatches to services (get data for student or for teacher etc).
      [ ] take out access control from backend... let frontend show the remove / resolve buttons itself since the check is so simple... they're already checking if they're in the queue to decide whether to show/hide "add name to queue" button.

ENDPOINTS
id/queues

CONTROLLERS
activeQueues: discerns whether it's a student or teacher requesting, then passes

SERVICES
activeQueue: getDataForStudent
activeQueue: getDataForTeacher

- students will just get all the queues associated with an endpoint => students will provide a endpoint string to the application
- teacher may want just the queue names if they're going to be changing them etc => teachers will get data by their user email
  - controllers handle the incoming requests (bridge between routes and business logic)
  - controllers should use services to get things from the db
  - services do the business logic. these exist to keep the controllers thin
    => controller should check on permissions etc. Probably handle the session and pass on appropriate parts to the service

* [ ] use projections etc so unnecessary data isn't sent
* [ ] use a url endpoint to identify which teacher, or something like that.

- [ ] implement in frontend
