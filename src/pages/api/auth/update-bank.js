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
    accountName = "",
    accountNumber = "",
    bankName = "",
    ifscCode = "",
  } = req.body || {};

  if (!accessToken || !accountName || !accountNumber || !bankName || !ifscCode) {
    res.status(400).json({ message: "Missing required bank detail fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: SHOPDIBZ_URLS.updateBankDetails,
    accessToken,
    method: "PUT",
    fields: {
      name: accountName,
      bank_name: bankName,
      account_number: accountNumber,
      ifsc: ifscCode,
    },
  });

  res.status(result.status).json(result.data);
}
