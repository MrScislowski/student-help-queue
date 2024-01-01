# Table Of Contents

1. [API Endpoints](#api-endpoints)
1. [Google Cloud Settings](#google-cloud-settings)
1. [Deployment Instructions](#deployment-instructions)
1. [Database Schema](#database-schema)
1. [ChatGPT prompt](#chatgpt-prompt)

# API Endpoints

| Method | Endpoint                                                        | Description                                                                                  | Parameters                                                                                                                       | Request Body                                                                      | Response                     |
| ------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------- |
| GET    | /teachers                                                       | List teacher accounts (admin only)                                                           | None                                                                                                                             |                                                                                   | Array of TeacherBase objects |
| POST   | /teachers                                                       | Create a new teacher account (admin only)                                                    | None                                                                                                                             | {email: "teacher email", slug: "proposed teacher slug"}                           | The created teacher object   |
| GET    | /teachers/:teacherSlug                                          | Get teacher info (you must be that teacher)                                                  | `teacherSlug`: your teacher slug                                                                                                 | None                                                                              | Teacher object               |
| GET    | /teachers/:teacherSlug/classes/:classSlug/queues                | Get all the queues for a class                                                               | `teacherSlug`: The slug for the teacher who owns the class<br>`classSlug`: The ID of the class                                   | None                                                                              | An array of queue objects    |
| POST   | /teachers/:teacherSlug/classes/:classSlug/queues                | Create a new queue for a class                                                               | `teacherSlug`: The slug for the teacher who owns the class<br>`classSlug`: The ID of the class                                   | {queueName: "new queue name"}                                                     | The created queue object     |
| DELETE | /teachers/:teacherSlug/classes/:classSlug/queues/:queueId       | Delete a queue from a class                                                                  | `teacherSlug`: The slug for the teacher who owns the class<br>`classSlug`: The ID of the class<br>`queueId`: The ID of the queue | None                                                                              | The deleted queue object     |
| PATCH  | /teachers/:teacherSlug/classes/:classSlug/queues/:queueId       | Change the visibility of a queue                                                             | `teacherSlug`: The slug for the teacher who owns the class<br>`classSlug`: The ID of the class<br>`queueId`: The ID of the queue | `{ visible: true\|false}`                                                         | The updated queue object     |
| PATCH  | /teachers/:teacherSlug/classes/:classSlug/queues/:queueId       | Rename a queue                                                                               | `teacherSlug`: The slug for the teacher who owns the class<br>`classSlug`: The ID of the class<br>`queueId`: The ID of the queue | {queueName: "completed 8.1a"}                                                     | The updated queueName        |
| POST   | /teachers/:teacherSlug/classes/:classSlug/queues/:queueId/users | Add your name to a queue                                                                     | `teacherSlug`: The slug for the teacher who owns the class<br>`classSlug`: The ID of the class<br>`queueId`: The ID of the queue |                                                                                   | The updated queue object     |
| DELETE | /teachers/:teacherSlug/classes/:classSlug/queues/:queueId/users | Remove your name or another user's name from a queue of a class (admin only for other users) | `teacherSlug`: The slug for the teacher who owns the class<br>`classSlug`: The ID of the class<br>`queueId`: The ID of the queue | {email: "user@example.com"} (optional), {resolutionStatus: "cancel" \| "resolve"} | The updated queue object     |

# Google Cloud Settings

| App name         | JS origins                                                                                                                            | Redirect URIs                                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| student frontend | <ul><li>`https://student-help-queue-frontend-f91c0ecec0d2.herokuapp.com`</li><li>`https://localhost:3000`</li><li>`https://localhost` | <ul><li>`https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/login`</li><li>`https://student-help-queue-frontend-f91c0ecec0d2.herokuapp.com`</li><li>`https://localhost:3000`</li><li>`https://localhost`</li> |
| teacher frontend | <ul><li>`https://help-queue-teacher-frontend-239b686a3dfd.herokuapp.com`</li><li>`https://localhost:3000`</li><li>`https://localhost` | <ul><li>`https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/login`</li><li>`https://help-queue-teacher-frontend-239b686a3dfd.herokuapp.com`</li><li>`https://localhost:3000`</li><li>`https://localhost`</li> |
| admin frontend   | <ul><li>`https://localhost:3000`</li><li>`https://localhost`</li></ul>                                                                | <ul><li>`https://help-queue-backend-cb8730ae9c9f.herokuapp.com/api/login`</li><li>`https://help-queue-teacher-frontend-239b686a3dfd.herokuapp.com`</li><li>`https://localhost:3000`</li><li>`https://localhost`</li> </ul>   |

# Deployment Instructions

## URL references

| App              | Hosted URL                                                     | Git remote              | Heroku URL                                             |
| ---------------- | -------------------------------------------------------------- | ----------------------- | ------------------------------------------------------ |
| student-frontend | https://help-queue-student-frontend-71154636b8a6.herokuapp.com | heroku-student-frontend | https://git.heroku.com/help-queue-student-frontend.git |
| teacher-frontend | https://help-queue-teacher-frontend-239b686a3dfd.herokuapp.com | heroku-teacher-frontend | https://git.heroku.com/help-queue-teacher-frontend.git |
| admin-frontend   | https://help-queue-admin-frontend-a43b988e9d22.herokuapp.com   | heroku-admin-frontend   | https://git.heroku.com/help-queue-admin-frontend.git   |
| backend          | https://help-queue-backend-cb8730ae9c9f.herokuapp.com          | heroku-backend          | https://git.heroku.com/help-queue-backend.git          |

## Pushing to Heroku

(When you want to trigger a rebuild of the Heroku app):

`git commit --allow-empty -m "Trigger Heroku rebuild"`

| App              | Git command                                                               | Debug command                                          |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| student-frontend | `git subtree push --prefix student-frontend heroku-student-frontend main` | `heroku logs --tail --app help-queue-student-frontend` |
| teacher-frontend | `git subtree push --prefix teacher-frontend heroku-teacher-frontend main` | `heroku logs --tail --app help-queue-teacher-frontend` |
| admin-frontend   | `git subtree push --prefix admin-frontend heroku-admin-frontend main`     | `heroku logs --tail --app help-queue-admin-frontend`   |
| backend          | `git subtree push --prefix backend heroku-backend main`                   | `heroku logs --tail --app help-queue-backend`          |

# Database Schema

1. Teachers Collection

- `_id`: ObjectId - unique identifier for the user
- `email`: String - email address of the user
- `slug`: String - username of the user
- `classes`: ObjectId[] - array of class IDs that the user is a teacher of

2. Classes Collection

- `_id`: ObjectId - unique identifier for the class
- `classSlug`: String - endpoint of the class
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

# ChatGPT prompt

I am writing a web app that is like a ticketing systems for teachers and students to use. Teachers can create classes, and separate queues within each class. Queues could represent immediate requests for assistance, or indicate that an assignment has been completed. Students can then add their names to these queues, and they (or their teacher) can remove their name once the request has been resolved.

The structure of the web app is a backend in nodeJS using express that communicates with a MongoDB database. There are two frontend apps - one for use by teachers, and one for use by students.

The student frontend allows students to view the active queues in their class, and they can add and remove the names from those queues.

The teacher frontend allows the teacher to remove names from queues, but also to rename queues, change their visibility, and add/remove queues.
