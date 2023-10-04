// load("db_sandbox.js")

db.queues.deleteMany({});

db.queues.insertMany([
  {
    name: "help",
    _id: ObjectId(),
    entries: [
      {
        _id: ObjectId(),
        user: {
          email: "ineedhelp@gmail.com",
          givenName: "Daniel",
          lastName: "Scislowski",
        },
        timestamp: new Date(Date.now()),
      },
      {
        _id: ObjectId(),
        user: {
          email: "ialsoneedhelp@gmail.com",
          givenName: "Mary",
          lastName: "Taylor",
        },
        timestamp: new Date(Date.now() + 1000),
      },
    ],
  },

  {
    name: "completed",
    _id: ObjectId(),
    entries: [
      {
        _id: ObjectId(),
        user: {
          email: "imalsodone@gmail.com",
          givenName: "Alan",
          lastName: "Brash",
        },
        timestamp: new Date(Date.now()),
      },
      {
        _id: ObjectId(),
        user: {
          email: "imdone@gmail.com",
          givenName: "all",
          lastName: "done",
        },
        timestamp: new Date(Date.now() + 1000),
      },
      {
        _id: ObjectId(),
        user: {
          email: "removeme@gmail.com",
          givenName: "remove",
          lastName: "me",
        },
        timestamp: new Date(Date.now() + 1000),
      },
    ],
  },
]);

// remove a name from the database
print(
  db.queues.updateOne(
    { name: "completed" },
    { $pull: { entries: { "user.email": "removeme@gmail.com" } } }
  )
);

db.queues.updateOne(
  { name: "completed" },
  {
    $push: {
      entries: {
        _id: ObjectId(),
        user: {
          email: "newlycreated@gmail.com",
          givenName: "newly",
          lastName: "created",
        },
        timestamp: new Date(Date.now()),
      },
    },
  }
);

print(db.queues.findOne({ name: "completed" }));
