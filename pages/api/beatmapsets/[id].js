import axios from "axios";

const handler = async (req, res) => {
  const { query } = req;
  const { id } = query;

  try {
    const result = await axios.get(
      `https://map-rank-times.onrender.com/beatmapsets/${id}`
    );
    res.status(200).json(result.data);
  } catch (error) {
    res.status(404).json({ error: `Beatmapset with id: ${id} not found.` })
  }
};

export default handler;
