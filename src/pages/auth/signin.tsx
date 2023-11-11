import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { useRouter } from "next/router";
import SignInError from "~/features/auth/components/SignInError";

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
  const { error } = useRouter().query;

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
              {error && (
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
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log("session:", session);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
