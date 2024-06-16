import { createClient } from "@supabase/supabase-js";

const handler = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=150");

  const updatedMaps = req.body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.from("beatmapsets").select("*").in("id", updatedMaps);

  if (!data || error) {
    res.status(404).json({ error: `Failed to get updated maps.` });
  } else {
    res.status(200).json(data);
  }
};

export default handler;
