# API Endpoints

| Method | Endpoint                                                    | Description                                                                                  | Parameters                                                       | Request Body                                                                      | Response                   |
| ------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------- |
| POST   | /teachers                                                   | Create a new teacher account                                                                 | None                                                             | {teacherId: "new-teacher-id"}                                                     | The created teacher object |
| GET    | /teachers/:teacherId/classes/:classId/queues                | Get all the queues for a class                                                               | `classId`: The ID of the class                                   | None                                                                              | An array of queue objects  |
| POST   | /teachers/:teacherId/classes/:classId/queues                | Create a new queue for a class                                                               | `classId`: The ID of the class                                   | {queueName: "new queue name"}                                                     | The created queue object   |
| DELETE | /teachers/:teacherId/classes/:classId/queues/:queueId       | Delete a queue from a class                                                                  | `classId`: The ID of the class<br>`queueId`: The ID of the queue | None                                                                              | The deleted queue object   |
| PATCH  | /teachers/:teacherId/classes/:classId/queues/:queueId       | Change the visibility of a queue                                                             | `classId`: The ID of the class<br>`queueId`: The ID of the queue | `{ visible: true\|false}`                                                         | The updated queue object   |
| PATCH  | /teachers/:teacherId/classes/:classId/queues/:queueId       | Rename a queue                                                                               | `classId`: The ID of the class<br>`queueId`: The ID of the queue | {queueName: "completed 8.1a"}                                                     | The updated queueName      |
| POST   | /teachers/:teacherId/classes/:classId/queues/:queueId/users | Add your name or another user's name to a queue of a class (admin only for other users)      | `classId`: The ID of the class<br>`queueId`: The ID of the queue | {email: "user@example.com"} (optional)                                            | The updated queue object   |
| DELETE | /teachers/:teacherId/classes/:classId/queues/:queueId/users | Remove your name or another user's name from a queue of a class (admin only for other users) | `classId`: The ID of the class<br>`queueId`: The ID of the queue | {email: "user@example.com"} (optional), {resolutionStatus: "cancel" \| "resolve"} | The updated queue object   |

# Push Instructions

## backend

git subtree push --prefix backend heroku-backend main

## student-frontend

git subtree push --prefix student-frontend heroku-teacher-frontend main

## teacher-frontend

git commit --allow-empty -m "Trigger Heroku rebuild"
https://help-queue-teacher-frontend-239b686a3dfd.herokuapp.com
git subtree push --prefix teacher-frontend heroku-teacher-frontend main

# Debugging instructions

heroku logs --tail --app student-help-queue-backend

# Google credentials for student frontend:

## authorized javascript origins

https://localhost:3000
https://localhost
https://student-help-queue-frontend-f91c0ecec0d2.herokuapp.com

## redirect URLs

https://localhost:3000
https://localhost
https://student-help-queue-frontend-f91c0ecec0d2.herokuapp.com
https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/login

# ChatGPT prompt

I am writing a web app that is like a ticketing systems for teachers and students to use. Teachers can create classes, and separate queues within each class. Queues could represent immediate requests for assistance, or indicate that an assignment has been completed. Students can then add their names to these queues, and they (or their teacher) can remove their name once the request has been resolved.

The structure of the web app is a backend in nodeJS using express that communicates with a MongoDB database. There are two frontend apps - one for use by teachers, and one for use by students.

The student frontend allows students to view the active queues in their class, and they can add and remove the names from those queues.

The teacher frontend allows the teacher to remove names from queues, but also to rename queues, change their visibility, and add/remove queues.

I am wondering how to handle the adding of a new teacher account. Should this be part of the teacher frontend? Or should I have a third frontend - an admin frontend?
