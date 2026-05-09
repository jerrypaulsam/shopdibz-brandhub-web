import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email, password, loc = "" } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("pfId", "browser");
  formData.append("token", "push");
  formData.append("pf", "Web");
  formData.append("loc", loc);

  try {
    const response = await fetch(`${API_BASE_URL}${SHOPDIBZ_URLS.login}`, {
      method: "POST",
      body: formData,
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Login request failed",
    });
  }
}
