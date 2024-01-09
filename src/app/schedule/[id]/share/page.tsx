import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Template } from "~/features/schedules/share/components/template";
import { cookies } from "next/headers";
import { hashText } from "~/utils/encryption";

export default async function Page({ params }: { params: { id: string } }) {
  const url = await api.url.exists.query({ id: params.id });
  if (!!url === false) {
    // 存在しないURLの場合はトップページに戻す
    redirect("/");
  }

  if (url.password !== null) {
    const key = hashText(`item_${params.id}`);

    const ok = cookies().has(key);

    if (!ok) {
      redirect(`/schedule/${params.id}/share/password`);
    }
  }

  const schedules = await api.schedule.fetch.query({ urlId: params.id });

  return <Template schedules={schedules} id={params.id} />;
}
