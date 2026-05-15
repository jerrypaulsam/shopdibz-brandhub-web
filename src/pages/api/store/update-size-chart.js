import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth, submitStoreForm } from "@/src/api/serverStoreProxy";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.setHeader("Allow", "POST, DELETE");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", chartBase64 = "", filename = "" } = req.body || {};

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Access token and store URL are required" });
    return;
  }

  if (req.method === "DELETE") {
    const result = await requestStoreJsonWithAuth({
      endpoint: `${SHOPDIBZ_URLS.updateSizeChart}${storeUrl}/`,
      accessToken,
      method: "DELETE",
    });

    res.status(result.status).json(result.data);
    return;
  }

  if (!chartBase64) {
    res.status(400).json({ message: "Size chart upload fields are missing" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.updateSizeChart}${storeUrl}/`,
    accessToken,
    method: "PUT",
    file: {
      field: "chart",
      base64: chartBase64,
      filename: resolveFilename(filename, storeUrl),
    },
  });

  res.status(result.status).json(result.data);
}

function resolveFilename(filename, storeUrl) {
  const normalized = String(filename || "").trim().toLowerCase();

  if (normalized.endsWith(".pdf")) {
    return `size-guide-${storeUrl}.pdf`;
  }

  if (normalized.endsWith(".png")) {
    return `size-guide-${storeUrl}.png`;
  }

  if (normalized.endsWith(".webp")) {
    return `size-guide-${storeUrl}.webp`;
  }

  return `size-guide-${storeUrl}.jpg`;
}
