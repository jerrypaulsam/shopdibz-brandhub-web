export const API_BASE_URL =
  process.env.NEXT_PUBLIC_SHOPDIBZ_API_BASE_URL || "https://loadapp.shopdibz.com";

export const SHOPDIBZ_URLS = {
  login: "/api/accounts/token_login/seller/",
  logout: "/api/accounts/logout/blacklist/",
  signup: "/api/accounts/signup/seller/",
  changePassword: "/api/accounts/change_password/",
  updateProfilePicture: "/api/accounts/update/profilePic/",
  updateAccount: "/api/accounts/update/",
  forgotOtp: "/api/accounts/forgot/",
  initialMobileOtp: "/api/accounts/init/mobile/otp_send/seller/",
  verifyInitialMobile: "/api/accounts/init/mobile/verification/seller/",
  resendEmailOtp: "/api/accounts/verify/email/resend/",
  verifyEmail: "/api/accounts/verify/email/",
  checkStoreVerification: "/api/store/verify/",
  store: "/api/store/",
  storeInfo: "/api/store/info/get/",
  storeBanner: "/api/store/store_carousel/",
  orders: "/api/orders/ordersList/sellerHub/",
  managers: "/api/store/managers/",
  notifications: "/api/notifications/all/seller/",
  reviewVoting: "/api/store/store_feedback/",
  products: "/api/products/",
  weeklyAnalytics: "/api/analytics/data/",
  dailyVisits: "/api/store/detail/",
  adWalletRecharge: "/api/ads/ad_wallet/recharge/page/",
  verifyGst: "/api/external/api/verify-gst/",
};
