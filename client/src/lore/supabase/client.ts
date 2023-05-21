import { Database } from "./types";
import { QueryClient } from "react-query";
import { SupabaseClient } from "@supabase/supabase-js";

export const client = new SupabaseClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
export const queryClient = new QueryClient();
