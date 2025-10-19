import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Template } from "~/features/schedules/share/components/template";
import { api } from "~/trpc/server";
import { hashText } from "~/utils/encryption";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const url = await api.url.exists({ id });
  if (!!url === false) {
    // 存在しないURLの場合はトップページに戻す
    redirect("/");
  }

  if (url?.password !== null) {
    const key = hashText(`item_${id}`);

    const cookieStore = await cookies();
    const ok = cookieStore.has(key);

    if (!ok) {
      redirect(`/schedule/${id}/share/password`);
    }
  }

  const schedules = await api.schedule.fetch({ urlId: id });

  return <Template schedules={schedules} id={id} />;
}
