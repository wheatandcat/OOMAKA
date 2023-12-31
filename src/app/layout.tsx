import "~/styles/globals.css";

import { Noto_Sans_JP } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

const notojp = Noto_Sans_JP({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});

const siteName = "OOMAKA | 年間スケジュール、まとめるなら";
const description = "サイトの説明";
const url = "https://oomaka.vercel.app";

export const metadata = {
  title: siteName,
  description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notojp.className}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
