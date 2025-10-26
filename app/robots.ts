// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/api/",
        "/_next/",
        "/checkout/",
        "/payment/",
        "/order-success/",
        "/my-orders/",
        "/my-profile/",
      ],
    },
    sitemap: "https://meghkala.com/sitemap.xml",
  };
}
