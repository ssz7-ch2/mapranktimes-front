import { createClient } from "@supabase/supabase-js";

const handler = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=150");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: updates, error: errorUpdates } = await supabase
    .from("updates")
    .select("updated_maps");
  if (!updates || errorUpdates) {
    res.status(404).json({ error: `Failed to get updated maps.` });
    return;
  }

  const updatedMaps = updates[0].updated_maps;
  const { data, error } = await supabase.from("beatmapsets").select("*").in("id", updatedMaps);

  console.log("getupdated");

  if (!data || error) {
    res.status(404).json({ error: `Failed to get updated maps.` });
  } else {
    res.status(200).json(data);
  }
};

export default handler;
