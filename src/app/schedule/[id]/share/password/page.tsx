import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import Template from "~/features/schedules/share/password/template";

export default async function Page({ params }: { params: { id: string } }) {
  const url = await api.url.exists.query({ id: params.id });
  if (!!url === false) {
    // 存在しないURLの場合はトップページに戻す
    redirect("/");
  }

  return <Template urlId={params.id} />;
}
       