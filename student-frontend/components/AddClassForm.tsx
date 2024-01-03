import React, { useState } from "react";
import { createClass } from "../utils/requests";
import { useMutation, useQueryClient } from "react-query";

interface AddClassFormProps {
  teacherSlug: string;
}

const AddClassForm = ({ teacherSlug }: AddClassFormProps) => {
  const [classSlug, setClassSlug] = useState("");

  const queryClient = useQueryClient();

  const addClassMutation = useMutation({
    mutationFn: async ({ classSlug }: { classSlug: string }) => {
      await createClass(teacherSlug, classSlug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addClassMutation.mutate({ classSlug: classSlug });
    setClassSlug("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={classSlug}
        onChange={(e) => setClassSlug(e.target.value)}
        placeholder="Enter class name"
      />
      <button type="submit">Add Class</button>
    </form>
  );
};

export default AddClassForm;
