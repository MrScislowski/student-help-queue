import React, { useState } from "react";
import { createQueue } from "../utils/requests";
import { useMutation, useQueryClient } from "react-query";

interface AddQueueFormProps {
  teacherSlug: string;
  classSlug: string;
}

const AddQueueForm = ({ teacherSlug, classSlug }: AddQueueFormProps) => {
  const [queueName, setQueueName] = useState("");

  const queryClient = useQueryClient();

  const addQueueMutation = useMutation({
    mutationFn: async ({ newName }: { newName: string }) => {
      await createQueue(classSlug, newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addQueueMutation.mutate({ newName: queueName });
    setQueueName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={queueName}
        onChange={(e) => setQueueName(e.target.value)}
        placeholder="Enter queue name"
      />
      <button type="submit">Add Queue</button>
    </form>
  );
};

export default AddQueueForm;
