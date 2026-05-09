import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJson } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { gstn = "" } = req.body || {};

  if (!gstn) {
    res.status(400).json({ message: "GSTIN is required" });
    return;
  }

  const result = await getStoreJson(`${SHOPDIBZ_URLS.verifyGst}${gstn}/`);
  res.status(result.status).json(result.data);
}
