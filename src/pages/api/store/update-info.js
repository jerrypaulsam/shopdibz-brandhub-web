import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken: explicitAccessToken = "",
    name = "",
    storeUrl = "",
    storeEmail = "",
    link1 = "",
    link2 = "",
    contactNo = "",
    description = "",
    address = "",
    city = "",
    pinCode = "",
    state = "",
    active = true,
    shipType = "SE",
    shipMode = "0",
    enableResell = false,
    category = "NONE",
    storeVideo = "",
  } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  const result = await submitStoreForm({
    endpoint: SHOPDIBZ_URLS.updateStoreInfo,
    accessToken,
    method: "PUT",
    fields: {
      name,
      url: storeUrl,
      email: storeEmail,
      link1,
      link2,
      cntNo: contactNo,
      desc: description,
      adrs: address,
      city,
      pCode: pinCode,
      state,
      active,
      shipType,
      mode: shipMode,
      resell: enableResell,
      category,
      video: storeVideo,
    },
  });

  res.status(result.status).json(result.data);
}
