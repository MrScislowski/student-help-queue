# API Endpoints

| Method | Endpoint                                | Description                                                                                  | Parameters                                                       | Request Body                                                                      | Response                  |
| ------ | --------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------- |
| GET    | /classes/:classId/queues                | Get all the queues for a class                                                               | `classId`: The ID of the class                                   | None                                                                              | An array of queue objects |
| POST   | /classes/:classId/queues                | Create a new queue for a class                                                               | `classId`: The ID of the class                                   | {queueName: "new queue name"}                                                     | The created queue object  |
| DELETE | /classes/:classId/queues/:queueId       | Delete a queue from a class                                                                  | `classId`: The ID of the class<br>`queueId`: The ID of the queue | None                                                                              | The deleted queue object  |
| PATCH  | /classes/:classId/queues/:queueId       | Change the visibility of a queue                                                             | `classId`: The ID of the class<br>`queueId`: The ID of the queue | `{ visible: true\|false}`                                                         | The updated queue object  |
| POST   | /classes/:classId/queues/:queueId/users | Add your name or another user's name to a queue of a class (admin only for other users)      | `classId`: The ID of the class<br>`queueId`: The ID of the queue | {email: "user@example.com"} (optional)                                            | The updated queue object  |
| DELETE | /classes/:classId/queues/:queueId/users | Remove your name or another user's name from a queue of a class (admin only for other users) | `classId`: The ID of the class<br>`queueId`: The ID of the queue | {email: "user@example.com"} (optional), {resolutionStatus: "cancel" \| "resolve"} | The updated queue object  |
| PATCH  | /classes/:classId/queues/:queueId       | Rename a queue                                                                               | `classId`: The ID of the class<br>`queueId`: The ID of the queue | {queueName: "completed 8.1a"}                                                     | The updated queueName     |

# Initial setup for deployment

git remote add heroku-teacher-frontend https://git.heroku.com/help-queue-teacher-frontend.git

# Push Instructions

## backend

## student-frontend

## teacher-frontend

git subtree push --prefix teacher-frontend heroku-teacher-frontend main
