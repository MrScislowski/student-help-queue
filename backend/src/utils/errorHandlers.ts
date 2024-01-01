import { Response } from "express";

// for use in services
function handleDatabaseError(error: unknown): never {
  if (error instanceof Error) {
    throw new Error(`DatabaseError: ${error.message}`);
  } else {
    throw new Error("DatabaseError: An unknown error occurred");
  }
}

// for use in controllers
function handleError(error: unknown, res: Response) {
  let message = "";
  if (error instanceof Error) {
    message += error.message;
  }
  return res.status(500).send({ error: message });
}

export { handleDatabaseError, handleError };
