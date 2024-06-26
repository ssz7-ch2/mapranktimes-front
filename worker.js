import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const connectDatabase = () => {
  const mapUpdatesChannel = supabase.channel("map-updates");
  mapUpdatesChannel
    .on("postgres_changes", { event: "*", schema: "public", table: "updates" }, async (payload) => {
      if (payload.new.deleted_maps.length + payload.new.updated_maps.length === 0) return;
      postMessage(payload.new);
    })
    .subscribe((status, error) => {
      if (status === "CLOSED") {
        console.log("Realtime channel closed.", new Date().toISOString());
      }

      if (status === "SUBSCRIBED") {
        console.log("Realtime channel subscribed.", new Date().toISOString());
      }

      if (status === "CHANNEL_ERROR") {
        console.log("Realtime channel error.", new Date().toISOString());
      }

      if (status === "TIMED_OUT") {
        console.log("Realtime channel timeout.", new Date().toISOString());
      }
    });
};

connectDatabase();
