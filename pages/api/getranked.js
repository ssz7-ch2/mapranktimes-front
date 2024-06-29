import { createClient } from "@supabase/supabase-js";

const handler = async (req, res) => {
  res.setHeader("Cache-Control", "max-age=60, s-maxage=300");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase.from("beatmapsets").select("*").is("queue_date", null);

  console.log("getranked");

  if (!data || error) {
    res.status(404).json({ error: `Failed to get ranked maps.` });
  } else {
    res.status(200).json(data);
  }
};

export default handler;
