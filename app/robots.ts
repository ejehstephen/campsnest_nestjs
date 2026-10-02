import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://campsnest.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/housing",
          "/market",
          "/connect",
          "/privacy",
          "/terms",
          "/login",
          "/signup"
        ],
        disallow: [
          "/profile",
          "/messages",
          "/notifications",
          "/settings",
          "/api/*"
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
