import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Period from "~/features/schedules/components/Period";
import Items from "~/features/schedules/components/Items";
import { api } from "~/utils/api";
import dayjs from "dayjs";

const items = [
  {
    month: 1,
  },
  {
    month: 2,
  },
  {
    month: 3,
  },
  {
    month: 4,
  },
  {
    month: 5,
  },
  {
    month: 6,
  },
  {
    month: 7,
  },
  {
    month: 8,
  },
  {
    month: 9,
  },
  {
    month: 10,
  },
  {
    month: 11,
  },
  {
    month: 12,
  },
];

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>OMAKA | 年間スケジュール、まとめるなら</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto gap-12 px-4 pt-3">
        <div>
          <Period
            startDate={dayjs().format()}
            endDate={dayjs().add(1, "years").format()}
          />
        </div>
        <div className="flex flex-wrap pt-10">
          {items.map((item) => (
            <div key={item.month} className="pb-16 pr-16">
              <Items month={item.month} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
