import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CampsNest - Campus SuperApp",
    short_name: "CampsNest",
    description: "Student Housing, Campus Marketplace & Roommate Matchmaking for Nigerian Universities",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0D14",
    theme_color: "#7C3AED",
    orientation: "portrait",
    icons: [
      {
        src: "/campsnest-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
