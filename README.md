# API Endpoints

Here:

| Method | Endpoint                          | Description                              | Parameters                                                       | Request Body                              | Response                  |
| ------ | --------------------------------- | ---------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------- | ------------------------- |
| GET    | /classes/:classId/queues          | Get all the queues for a class           | `classId`: The ID of the class                                   | None                                      | An array of queue objects |
| POST   | /classes/:classId/queues/:queueId | Add your name to a queue of a class      | `classId`: The ID of the class<br>`queueId`: The ID of the queue | None                                      | The updated queue object  |
| DELETE | /classes/:classId/queues/:queueId | Remove your name from a queue of a class | `classId`: The ID of the class<br>`queueId`: The ID of the queue | {resolutionStatus: "cancel" \| "resolve"} | The updated queue object  |
