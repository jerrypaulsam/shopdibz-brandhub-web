import { SHOPDIBZ_URLS } from "@/src/api/config";
import { putFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", fName = "", lName = "", email = "" } = req.body || {};

  if (!accessToken || !fName || !email) {
    res.status(400).json({ message: "First name, email, and access token are required" });
    return;
  }

  try {
    const response = await putFormToShopdibz(
      SHOPDIBZ_URLS.updateAccount,
      {
        fName,
        lName,
        email,
      },
      accessToken,
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Account update failed",
    });
  }
}
