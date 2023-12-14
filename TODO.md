NEXT:

# MongoDB Database Schema for Student Help Queue

## 1. **Users Collection**

- **\_id**: ObjectId - Unique identifier for the owner.
- **username**: String - Unique username.
- **email**: String - Owner's email address.
- **classes**: Array of ObjectIds - References to Class documents.

## 2. **Classes Collection**

- **\_id**: ObjectId - Unique identifier for the class.
- **title**: String - Name of the class.
- **description**: String - Brief description of the class.
- **owner**: ObjectId - Reference to the User who owns the class.
- **queues**: Array of ObjectIds - References to Queue documents.

## 3. **Queues Collection**

- **\_id**: ObjectId - Unique identifier for the Queue.
- **title**: String - Title of the Queue.
- **boardId**: ObjectId - Reference to the class this Queue belongs to.
- **tasks**: Array of ObjectIds - References to Task documents.

## 4. **Applicant Collection**

- **\_id**: ObjectId - Unique identifier for the Applicant.
- **email**: String - Title of the task.
- **firstName**: String - Description of the task.
- **lastName**: String - Current status (e.g., "todo", "in progress", "done").
- **timestamp**: Date - Optional due date for the task.
