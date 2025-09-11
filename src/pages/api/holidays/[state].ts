import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state } = req.query;

  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: "State code required" });
  }

  try {
    const filePath = path.join(process.cwd(), "data", `${state}.json`);
    const fileData = fs.readFileSync(filePath, "utf-8");
    const holidays = JSON.parse(fileData);

    res.status(200).json(holidays);
  } catch (err) {
    res.status(404).json({ error: "No data found for state" });
  }
}