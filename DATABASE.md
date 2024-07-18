# Database Schema

1. Teachers Collection

- `_id`: ObjectId - unique identifier for the user
- `email`: String - email address of the user
- `slug`: String - username of the user
- `classes`: ObjectId[] - array of class IDs that the user is a teacher of

2. Classes Collection

- `_id`: ObjectId - unique identifier for the class
- `classSlug`: String - endpoint of the class
- `className`: String - name of the class
- `teacher`: ObjectId, ref to `Teacher` - reference to the teacher who created the class. Can be populated to a `Teacher` object.
- `queues`: Queue[] - array of queues for the class

3. Queue Object

- `_id`: ObjectId - unique identifier for the queue
- `queueName`: String - name of the queue
- `visible`: Boolean - whether the queue is visible to students
- `entries`: Entry[] - array of entries in the queue

4. Entry Object

- `timeAdded`: String - time the entry was added to the queue
- `user`: User - user who added the entry to the queue

5. User Object

- `email`: String - email address of the user
- `givenName`: String - given name of the user
- `familyName`: String - family name of the user