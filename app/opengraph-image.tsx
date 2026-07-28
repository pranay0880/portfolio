import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#09090b",
          color: "#f4f4f5",
          padding: 96,
        }}
      >
        <div style={{ fontSize: 28, color: "#818cf8", display: "flex" }}>{profile.title}</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16, display: "flex" }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 24, display: "flex" }}>
          {profile.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
