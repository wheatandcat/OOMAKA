import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Noto_Sans_JP } from "next/font/google";
import "dayjs/locale/ja";
import { DatesProvider } from "@mantine/dates";

const notojp = Noto_Sans_JP({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <DatesProvider
      settings={{ locale: "ja", firstDayOfWeek: 0, weekendDays: [0] }}
    >
      <SessionProvider session={session}>
        <div className={notojp.className}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </DatesProvider>
  );
};

export default api.withTRPC(MyApp);
