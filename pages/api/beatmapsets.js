import axios from "axios";

const handler = async (req, res) => {
  const result = await axios.get(
    "https://map-rank-times.onrender.com/beatmapsets"
  );
  res.status(200).json(result.data);
};

export default handler;
