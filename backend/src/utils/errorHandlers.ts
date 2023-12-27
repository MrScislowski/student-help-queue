function handleDatabaseError(error: unknown): never {
  if (error instanceof Error) {
    throw new Error(`DatabaseError: ${error.message}`);
  } else {
    throw new Error("DatabaseError: An unknown error occurred");
  }
}

export { handleDatabaseError };
