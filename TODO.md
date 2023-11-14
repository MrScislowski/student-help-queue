[ ] add the ability to add / rename / hide queues
  [ ] implement a database filling command that will clear the dbs and allow for quick testing when changing schemas
    [x] fill accounts
    [ ] implement this new data structure:
      Based on how we're getting data, I think the account model should look like this: 

      {
        user: {
          email,
          lastName,
          givenName,
        },
        activeQueues: [
          {
            _id,
            name,
            entries: [
              {
              _id,
              user,
              timestamp,
              }
            ]
          }
        ],
        archivedQueues: [
          _id,
          name
        ]
      }

      * it's nice b/c you can get all the data you need from one query
      * the activeQueues can't _really_ grow w/o bound, because they're the ones you're going to be using
      * storing just the archivedQueue ids keeps storage good

    [ ] fill queues, and some entries

  [ ] change how the backend communicates
  [ ] implement in frontend