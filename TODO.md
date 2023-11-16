- [ ] add the ability to add / rename / hide queues
- [x] implement a database filling command that will clear the dbs and allow for quick testing when changing schemas
- [x] fill accounts
- [x] implement this new data structure:
- [x] fill queues, and some entries

- [ ] change how the backend communicates

  how to do all this... Maybe leave all the old shit in place and add a shiny new endpoint / thing that can probably replace all the rest.
  So think about how the frontends are going to request...

  - students will just get all the queues associated with an endpoint
    => students will provide a endpoint string to the application
  - teacher may want just the queue names if they're going to be changing them etc
    => teachers will get data by their user email

  * [ ] consolidate activeEntries and queues request so only one DB request is required... have getQueues function that takes an endpoint... students can use this
    - controllers handle the incoming requests (bridge between routes and business logic)
    - controllers should use services to get things from the db
    - services do the business logic. these exist to keep the controllers thin
      => controller should check on permissions etc. Probably handle the session and pass on appropriate parts to the service
  * [ ] use projections etc so unnecessary data isn't sent
  * [ ] use a url endpoint to identify which teacher, or something like that.

- [ ] implement in frontend
