import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", month = "", year = "" } = req.body || {};

  if (!accessToken || !storeUrl || !month || !year) {
    res.status(400).json({ message: "Missing invoice request fields" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `/api/store/monthly_inv/${storeUrl}/download/`,
    accessToken: String(accessToken),
    query: {
      mon: String(month),
      year: String(year),
    },
  });

  res.status(result.status).json(result.data);
}
