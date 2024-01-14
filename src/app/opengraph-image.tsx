import { ImageResponse } from "next/og";
import { Noto_Sans_JP } from "next/font/google";

const notojp = Noto_Sans_JP({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const revalidate = "force-cache";
export const runtime = "nodejs";

export const alt = "OGP画像";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        className={`${notojp.className}`}
        style={{
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{ height: 40, backgroundColor: "#000000", width: "100%" }}
        />
        <div
          style={{
            flex: 1,
            maxWidth: "80%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            paddingTop: 30,
            paddingBottom: 30,
          }}
        >
          <div
            style={{
              fontSize: 28,
            }}
          >
            年間スケジュール、まとめるなら
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: "0.5rem",
            }}
          >
            OOMAKA
          </div>
        </div>
        <div
          style={{ height: 40, backgroundColor: "#000000", width: "100%" }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
