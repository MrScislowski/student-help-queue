import { useQuery, useMutation, useQueryClient } from "react-query";
import { addName, resolveEntry, getActiveEntries } from "./requests";

export const useResolveEntryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(resolveEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries("activeEntries");
    },
  });
};

export const useAddNameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (queueName) => addName(queueName),
    onSuccess: () => {
      queryClient.invalidateQueries("activeEntries");
    },
  });
};

export const useGetActiveEntries = () => {
  return useQuery({
    queryKey: "activeEntries",
    queryFn: () => {
      getActiveEntries().then((res) => {
        console.log(`about to return ${JSON.stringify(res.data)}`);
        return res.data;
      });
    },
    refetchInterval: 2000,
  });
};
