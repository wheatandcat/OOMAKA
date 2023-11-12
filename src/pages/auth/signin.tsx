import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn, useSession } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { useRouter } from "next/router";
import SignInError from "~/features/auth/components/SignInError";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "~/server/db";

const authStyle: Record<string, { className: string; color: string }> = {
  Discord: {
    className: "bg-blue-600 text-white border border-blue-500",
    color: "blue",
  },
  GitHub: {
    className: "bg-gray-700 text-white border border-gray-700 ",
    color: "gray",
  },
  Google: {
    className: "bg-white text-black border border-black",
    color: "gray",
  },
  Apple: {
    className: "bg-black text-white border border-black",
    color: "gray",
  },
};

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { error } = router.query;
  const { data: sessionData } = useSession();

  if (sessionData) {
    void router.replace("/");
    return null;
  }

  return (
    <div>
      <div className="signin-bg fixed top-0 h-screen w-screen" />
      <div className="flex items-center justify-center">
        <div className="container z-10 flex h-screen flex-col items-center justify-center">
          <div className=" rounded-xl border bg-white px-20 py-4">
            <div>
              <div className="pb-10 pt-5 text-center">
                <div className="signin-mini-logo-title">
                  年間スケジュール、まとめるなら
                </div>
                <div className="signin-logo-title text-xl font-bold">
                  OOMAKA
                </div>
              </div>
              {!!error && (
                <div className="pb-6">
                  <SignInError error={String(error)}></SignInError>
                </div>
              )}
              <div className="flex flex-col items-center pb-10">
                {Object.values(providers ?? {}).map((provider) => {
                  const item = authStyle[String(provider?.name)];

                  return (
                    <div key={provider.name}>
                      <button
                        className={`my-3 w-72 rounded-lg px-4 py-2 font-bold ${String(
                          item?.className
                        )}`}
                        onClick={() => void signIn(provider.id)}
                      >
                        {provider.name} でログイン
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="pb-5 text-center text-sm text-gray-500">
                利用規約およびプライバシーポリシーに同意の上、
                <br />
                ログインへお進みください。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  console.log("session:", session);

  if (session) {
    const urlItem = await prisma.url.findFirst({
      where: {
        userId: String(session.user.id),
      },
    });
    if (urlItem) {
      return {
        redirect: {
          destination: `/schedule/${urlItem.id}`,
        },
      };
    }
    // 存在しない場合はカレンダーを新規作成する
    const createUrl = await prisma.url.create({
      data: {
        id: uuidv4(),
        userId: String(session.user.id),
      },
    });
    return {
      redirect: {
        destination: `/schedule/${createUrl.id}`,
      },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
