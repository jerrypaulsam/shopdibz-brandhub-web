import { SHOPDIBZ_URLS } from "@/src/api/config";
import { putFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    oldPassword = "",
    newPassword = "",
    confirmPassword = "",
  } = req.body || {};

  if (!accessToken || !oldPassword || !newPassword || !confirmPassword) {
    res.status(400).json({ message: "All password fields are required" });
    return;
  }

  try {
    const response = await putFormToShopdibz(
      SHOPDIBZ_URLS.changePassword,
      {
        old: oldPassword,
        new: newPassword,
        confirm: confirmPassword,
      },
      accessToken,
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Password change failed",
    });
  }
}
