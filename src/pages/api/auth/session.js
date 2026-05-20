import { clearAuthCookies } from "@/src/api/authCookies";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  clearAuthCookies(res);
  res.status(204).end();
}
