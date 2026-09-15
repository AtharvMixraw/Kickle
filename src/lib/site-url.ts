/** The canonical public URL used in links shared outside the app. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://playkickle.online";
