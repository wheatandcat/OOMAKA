import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          borderRadius: "50%",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#333",
        }}
      >
        <span>🗓️</span>
      </div>
    ),
    {
      ...size,
    },
  );
}
