import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";

const handler = async (req, res) => {
  const { updated_maps: updatedMaps, timestamp } = req.body;

  if (!timestamp) {
    res.status(404).json({ error: `Failed to get updated maps.` });
    return;
  }

  const redis = Redis.fromEnv();
  const dataCached = await redis.get(`updates-${timestamp}`);

  if (dataCached) {
    console.log("cache hit");
    res.status(200).json(typeof dataCached === "string" ? JSON.parse(dataCached) : dataCached);
    return;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.from("beatmapsets").select("*").in("id", updatedMaps);

  console.log("cache miss");

  if (!data || error) {
    res.status(404).json({ error: `Failed to get updated maps.` });
  } else {
    res.status(200).json(data);
  }
};

export default handler;
