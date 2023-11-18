import { type Metadata } from "next";
import { getServerAuthSession } from "~/server/auth";
import { Template } from "~/app/_components/schedule/template";

export const metadata: Metadata = {
  title: "OOMAKA | 年間スケジュール、まとめるなら",
};

export default async function Schedule() {
  const session = await getServerAuthSession();

  return <Template login={!!session} />;
}
