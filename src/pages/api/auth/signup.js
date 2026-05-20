import { SHOPDIBZ_URLS } from "@/src/api/config";
import { setAuthCookies } from "@/src/api/authCookies";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    email,
    fName,
    lName = "",
    password,
    confirmPassword,
    mobile,
    loc = "",
  } = req.body || {};

  if (!email || !fName || !password || !confirmPassword || !mobile) {
    res.status(400).json({ message: "Required signup fields are missing" });
    return;
  }

  const result = await postFormToShopdibz(SHOPDIBZ_URLS.signup, {
    email,
    fName,
    lName,
    pass1: password,
    pass2: confirmPassword,
    token: "",
    pf: "windows",
    pfId: "browser",
    loc,
    mob: mobile,
  });

  if (result.status >= 200 && result.status < 300) {
    setAuthCookies(res, result.data);
  }

  res.status(result.status).json(result.data);
}
