import { DOWNLOAD_SOURCE_ITEMS } from "@/src/data/downloads";

export const config = {
  api: {
    responseLimit: false,
  },
};

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const downloadItem = DOWNLOAD_SOURCE_ITEMS[String(id || "")];

  if (!downloadItem) {
    res.status(404).json({ message: "Download file not found" });
    return;
  }

  try {
    const upstreamResponse = await fetch(downloadItem.sourceUrl, {
      redirect: "follow",
    });

    if (!upstreamResponse.ok) {
      res.status(upstreamResponse.status).json({
        message: "Download source is unavailable",
      });
      return;
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType =
      upstreamResponse.headers.get("content-type") ||
      "application/octet-stream";
    const contentLength = upstreamResponse.headers.get("content-length");

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${downloadItem.filename}"`,
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, max-age=3600, must-revalidate");

    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    res.status(200).send(buffer);
  } catch (error) {
    console.error("[downloads-proxy]", error);
    res.status(502).json({ message: "Could not fetch the download file" });
  }
}
