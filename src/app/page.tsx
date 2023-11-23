import { type Metadata } from "next";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

import Layout from "~/components/Layout/Layout";
import { CreateUrl } from "~/app/_components/create-url";

export const metadata: Metadata = {
  title: "OOMAKA | 年間スケジュール、まとめるなら",
};

export default function Home() {
  return (
    <Layout>
      <>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[3rem]">
              年間スケジュール、まとめよう !
            </h1>

            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <br />
                <CrudShowcase />
              </div>
            </div>
          </div>
        </main>
      </>
    </Layout>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (session?.user) {
    const url = await api.url.existsByUserId.query({
      userId: String(session?.user.id),
    });
    if (url) redirect(`/schedule/${String(url?.id)}`);
  }

  return <CreateUrl />;
}
