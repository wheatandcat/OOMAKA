"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import SignInError from "~/features/auth/components/SignInError";
import { NextAuthProvider } from "~/app/providers";
import { useEffect, useCallback, useRef } from "react";
import { api } from "~/trpc/react";

const providers: {
  id: string;
  name: string;
  className: string;
  color: string;
}[] = [
  {
    id: "discord",
    name: "Discord",
    className: "bg-blue-600 text-white border border-blue-500",
    color: "blue",
  },
  {
    id: "google",
    name: "Google",
    className: "bg-white text-black border border-black",
    color: "gray",
  },
  {
    id: "apple",
    name: "Apple",
    className: "bg-black text-white border border-black",
    color: "gray",
  },
];

export default function SignIn() {
  return (
    <NextAuthProvider>
      <ClientHome />
    </NextAuthProvider>
  );
}

function ClientHome() {
  const router = useRouter();
  const params = useParams();
  const { error } = params;
  const { data: sessionData } = useSession();
  const loading = useRef(false);

  const url = api.url.existsByUserId.useQuery(
    {
      userId: String(sessionData?.user?.id),
    },
    {
      enabled: false,
    },
  );

  const createMutation = api.url.create.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      window.localStorage.setItem("URL_ID", data.id);
      router.push(`/schedule/${data.id}`);
    },
  });

  const onRedirect = useCallback(async () => {
    const u = await url.refetch();
    if (u) {
      void router.push(`/schedule/${String(u.data?.id)}`);
      return;
    }

    createMutation.mutate({ userId: String(sessionData?.user?.id) });
  }, [createMutation, router, sessionData?.user?.id, url]);

  useEffect(() => {
    if (sessionData && !loading.current) {
      loading.current = true;
      void onRedirect();
    }
  }, [sessionData, onRedirect]);

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
                {providers.map((provider) => {
                  return (
                    <div key={provider.id}>
                      <button
                        className={`my-3 w-72 rounded-lg px-4 py-2 font-bold ${String(
                          provider.className,
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
