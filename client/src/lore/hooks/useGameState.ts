import { client } from "../supabase/client";
import { useQuery } from "react-query";

export const useGameState = (id: string) => {
  return useQuery({
    queryKey: ["state", id],
    queryFn: async () => {
      const { data, error } = await client
        .from("state")
        .select("*")
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
