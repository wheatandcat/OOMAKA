"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SignInError from "~/features/auth/components/SignInError";
import { NextAuthProvider } from "~/app/providers";
import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
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
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const urlID = getUrlId();
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

  const url2 = api.url.exists.useQuery(
    {
      id: String(urlID),
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
      document.cookie = `URL_ID=${encodeURIComponent(data.id)}; path=/`;
      router.refresh();
      router.push(`/schedule/${data.id}`);
    },
  });

  const updateMutation = api.url.update.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      document.cookie = `URL_ID=${encodeURIComponent(data.id)}; path=/`;
      router.refresh();
      router.push(`/schedule/${data.id}`);
    },
  });

  const onRedirect = useCallback(async () => {
    const u1 = await url.refetch();
    if (u1?.data?.id) {
      document.cookie = `URL_ID=${encodeURIComponent(u1?.data?.id)}; path=/`;
      router.refresh();
      void router.push(`/schedule/${String(u1.data?.id)}`);
      return;
    }

    if (urlID) {
      const u2 = await url2.refetch();
      if (u2?.data?.id) {
        // 既にカレンダーが存在する場合は、認証したユーザー情報と紐付ける
        updateMutation.mutate({
          id: String(u2.data?.id),
          userId: String(sessionData?.user?.id),
          password: "",
        });
        return;
      }
    }

    createMutation.mutate({ userId: String(sessionData?.user?.id) });
  }, [
    createMutation,
    router,
    sessionData?.user?.id,
    updateMutation,
    url,
    url2,
    urlID,
  ]);

  useEffect(() => {
    if (sessionData && !loading.current) {
      loading.current = true;
      void onRedirect();
    }
  }, [sessionData, onRedirect]);

  return (
    <div>
      <div className="fixed top-0 h-screen w-screen bg-blue-600" />
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
              <div className="http://localhost:3000/ pb-5 text-center text-xs text-gray-500 sm:text-sm">
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-medium text-blue-400"
                >
                  利用規約
                </Link>
                および
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-medium text-blue-400"
                >
                  プライバシーポリシー
                </Link>
                に同意の上、 <br />
                ログインへお進みください。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getUrlId(): string | null {
  if (typeof window !== "undefined") {
    const encodedUrl = window.location.href;

    // 外側のURLをパースする
    const url = new URL(encodedUrl);
    const callbackUrl = url.searchParams.get("callbackUrl");

    if (!callbackUrl) {
      return null;
    }

    // callbackUrlをデコードし、URLパラメータを解析する
    const decodedCallbackUrl = decodeURIComponent(callbackUrl);
    const callbackUrlParams = new URLSearchParams(
      decodedCallbackUrl.split("?")[1],
    );

    // "urlID" の値を取得する
    return callbackUrlParams.get("urlID");
  }

  return "";
}
