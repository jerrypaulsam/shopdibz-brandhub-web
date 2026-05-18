export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { ifscCode = "" } = req.body || {};
  const normalizedIfsc = String(ifscCode).trim().toUpperCase();

  if (!normalizedIfsc) {
    res.status(400).json({ message: "IFSC code is required" });
    return;
  }

  try {
    const response = await fetch(
      `https://bank-apis.justinclicks.com/API/V1/IFSC/${encodeURIComponent(normalizedIfsc)}/`,
    );
    const text = await response.text();

    if (!response.ok) {
      res.status(response.status).json({ message: "Not A Valid IFSC Code" });
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const bankName = String(
        parsed?.bank || parsed?.BANK || parsed?.bankName || parsed?.bank_name || "",
      ).trim();
      const address = String(parsed?.address || parsed?.ADDRESS || "").trim();
      const branch = String(parsed?.branch || parsed?.BRANCH || "").trim();

      res.status(response.status).json({
        ...parsed,
        bank: bankName,
        address,
        branch,
      });
    } catch {
      res.status(response.status).json({ message: text || "IFSC lookup failed" });
    }
  } catch {
    res.status(500).json({ message: "IFSC lookup failed" });
  }
}
