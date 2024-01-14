import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  const fontData = await fetch(
    new URL("../../../../public/NotoSansJP-Bold2.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          fontFamily: '"NotoSansJP"',
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
              fontWeight: 800,
              letterSpacing: "0.5rem",
              paddingLeft: "2rem",
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
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "NotoSansJP",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
