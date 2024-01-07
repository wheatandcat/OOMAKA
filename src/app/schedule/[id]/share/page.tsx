import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Template } from "~/features/schedules/share/components/template";

export default async function Page({ params }: { params: { id: string } }) {
  const url = await api.url.exists.query({ id: params.id });
  if (!!url === false) {
    // 存在しないURLの場合はトップページに戻す
    redirect("/");
  }

  const schedules = await api.schedule.fetch.query({ urlId: params.id });

  return <Template schedules={schedules} id={params.id} />;
}
