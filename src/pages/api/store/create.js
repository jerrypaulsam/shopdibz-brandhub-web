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
    regName = "",
    regId = "",
    gstin = "",
    ref = "",
    signatureBase64 = "",
    enable = true,
  } = req.body || {};

  if (!accessToken || !regName || !regId || !gstin || !signatureBase64) {
    res.status(400).json({ message: "Missing required store creation fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: SHOPDIBZ_URLS.createStore,
    accessToken,
    method: "PUT",
    fields: {
      regName,
      regId,
      gstin,
      ref,
      enable,
    },
    file: {
      field: "idDoc",
      base64: signatureBase64,
      filename: `signature-${regName}.png`,
    },
  });

  res.status(result.status).json(result.data);
}
