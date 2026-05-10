import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", questionId = 0, answer = "", orderId = "" } = req.body || {};

  if (!accessToken || !questionId || !answer) {
    res.status(400).json({ message: "Access token, question ID, and answer are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.products}question/${questionId}/answer/create/`,
    accessToken,
    method: "POST",
    fields: {
      answer,
      orderId,
    },
  });

  res.status(result.status).json(result.data);
}
