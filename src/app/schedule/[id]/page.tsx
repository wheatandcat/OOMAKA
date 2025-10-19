import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Template } from "~/features/schedules/components/template";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await cookies(); // Next.js 15で動的レンダリングを明示
  const session = await auth();

  const url = await api.url.exists({ id });
  if (url === null) {
    // 存在しないURLの場合はトップページに戻す
    redirect("/");
  }

  if (url.userId && url.userId !== "" && url.userId !== session?.user?.id) {
    // URLのユーザーIDとログインしているユーザーIDが一致しない場合はトップページに戻す
    redirect("/");
  }

  const schedules = await api.schedule.fetch({ urlId: id });

  return (
    <Template
      login={!!session}
      schedules={schedules}
      id={id}
      isPassword={url.password !== null}
      userId={session?.user?.id ?? ""}
    />
  );
}
