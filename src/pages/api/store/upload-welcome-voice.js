import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    storeUrl = "",
    audioBase64 = "",
    filename = "welcome_voice.webm",
  } = req.body || {};

  if (!accessToken || !storeUrl || !audioBase64) {
    res.status(400).json({ message: "Welcome audio upload fields are missing" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.store}welcome-voice/${storeUrl}/update/`,
    accessToken,
    method: "PATCH",
    file: {
      field: "welcome_voice",
      base64: audioBase64,
      filename: resolveFilename(filename),
    },
  });

  res.status(result.status).json(result.data);
}

function resolveFilename(filename) {
  const normalized = String(filename || "welcome_voice.webm").trim();
  const extension = normalized.includes(".")
    ? normalized.split(".").pop()
    : "webm";

  return `welcome_voice_${Date.now()}.${extension || "webm"}`;
}
