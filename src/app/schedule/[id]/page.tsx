import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Template } from "~/app/_components/schedule/template";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();

  const url = await api.url.exists.query({ id: params.id });
  if (url === null) {
    // 存在しないURLの場合はトップページに戻す
    redirect("/");
  }

  if (url.userId != "" && url?.userId !== session?.user?.id) {
    // URLのユーザーIDとログインしているユーザーIDが一致しない場合はトップページに戻す
    redirect("/");
  }

  const schedules = await api.schedule.fetch.query({ urlId: params.id });

  return (
    <Template
      login={!!session}
      schedules={schedules}
      id={params.id}
      userId={session?.user?.id ?? ""}
    />
  );
}
