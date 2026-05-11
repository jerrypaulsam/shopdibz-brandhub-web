import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const authHeader = String(req.headers.authorization || "");
  const accessToken =
    authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const { storeUrl = "", userCode = "", message = "" } = req.body || {};

  if (!accessToken || !storeUrl || !userCode || !message) {
    res.status(400).json({ message: "Missing order message fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.sendOrderMessage}${storeUrl}/`,
    accessToken: String(accessToken),
    fields: {
      uCode: userCode,
      msg: message,
    },
  });

  res.status(result.status).json(result.data);
}
