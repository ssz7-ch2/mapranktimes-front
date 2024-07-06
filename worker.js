import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

let mapUpdatesChannel = null;
let lastUpdated = null;
let checkForUpdates = false;

const sendBeatmaps = async (lastUpdated) => {
  const { data, error } = await supabase.from("updates").select("timestamp");
  if (data && data[0].timestamp > lastUpdated) {
    const { data, error } = await supabase
      .from("beatmapsets")
      .select("*")
      .not("queue_date", "is", null);
    if (data) {
      const beatmapSets = data
        .map((beatmapSet) => {
          const parsedBeatmaps =
            typeof beatmapSet.beatmaps === "string"
              ? JSON.parse(beatmapSet.beatmaps)
              : beatmapSet.beatmaps;
          return {
            ...beatmapSet,
            beatmaps: parsedBeatmaps.sort((a, b) => a.mode - b.mode),
          };
        })
        .sort((a, b) =>
          a.rank_date_early === b.rank_date_early
            ? a.queue_date - b.queue_date
            : a.rank_date_early - b.rank_date_early
        );

      postMessage(beatmapSets);
    }
  }
};

const restartConnection = async () => {
  await mapUpdatesChannel?.unsubscribe();
  checkForUpdates = true;
  connectDatabase();
};

const connectDatabase = () => {
  mapUpdatesChannel = supabase.channel("map-updates");
  mapUpdatesChannel
    .on("postgres_changes", { event: "*", schema: "public", table: "updates" }, async (payload) => {
      lastUpdated = payload.new.timestamp;
      if (payload.new.deleted_maps.length + payload.new.updated_maps.length === 0) return;
      postMessage(payload.new);
    })
    .subscribe((status, error) => {
      if (status === "CLOSED") {
        console.log("Realtime channel closed.", new Date().toISOString());
      }

      if (status === "SUBSCRIBED") {
        console.log("Realtime channel subscribed.", new Date().toISOString());
        if (checkForUpdates && lastUpdated) {
          sendBeatmaps(lastUpdated);
        }
        lastUpdated = Date.now();
      }

      if (status === "CHANNEL_ERROR") {
        console.log("Realtime channel error.", new Date().toISOString());
        restartConnection();
      }

      if (status === "TIMED_OUT") {
        console.log("Realtime channel timeout.", new Date().toISOString());
      }
    });
};

connectDatabase();
