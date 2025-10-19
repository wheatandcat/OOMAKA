import { redirect } from "next/navigation";
import Template from "~/features/schedules/share/password/components/template";
import { api } from "~/trpc/server";

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

	return <Template urlId={id} />;
}
