import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import Header from "~/components/Layout/Header";
import { CreateUrl } from "~/features/top/components/create-url";
import { cookies } from "next/headers";

export default function Home() {
  return (
    <div className="container relative mx-auto max-w-screen-xl gap-12 ">
      <Header />
      <main className="item-center flex min-h-screen flex-col bg-gradient-to-b py-5">
        <div className="flex flex-col-reverse items-center gap-12 lg:container lg:flex-row lg:items-center">
          <div>
            <div className="text-xl font-extrabold sm:text-3xl">
              今年の予定、ざっくり決める
            </div>
            <p className="break-all pt-5 text-sm leading-7">
              OOMAKAは1年間のスケジュールをざっくり書き出して、
              <br />
              全体の予定を把握するwebサービスです。
              <br />
              タスク1つにつき10文字、1ヶ月5件まで登録できます。
              <br />
              ログインすると、過去のタスク閲覧や、
              <br />
              スケジュールの限定公開ができるようになります。
              <br />
              まずは試してみてください！
            </p>

            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <br />
                <CrudShowcase />
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/top.svg"
              alt="top"
              width={572}
              height={407}
              className="rounded-full"
            />
          </div>
        </div>
      </main>
    </div>
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

  const urlId = cookies().get("URL_ID");
  if (urlId) {
    const url = await api.url.exists.query({ id: String(urlId.value) });
    if (url) redirect(`/schedule/${String(url?.id)}`);
  }

  return <CreateUrl />;
}
