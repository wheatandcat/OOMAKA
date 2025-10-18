"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { api } from "~/trpc/react";

export function CreateUrl() {
  const router = useRouter();

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

  const onCreateURL = useCallback(() => {
    createMutation.mutate({ userId: "" });
  }, [createMutation]);

  return (
    <>
      <button
        type="button"
        className="w-72 border-2 border-black px-10 py-2 font-semibold text-black transition hover:border-gray-500 hover:text-gray-500 "
        onClick={onCreateURL}
      >
        カレンダーを作る
      </button>
      <button
        type="button"
        className="border- my-3 w-72 border-blue-500 bg-blue-500 px-10 py-2 font-semibold text-white no-underline transition hover:bg-blue-300"
        onClick={() => void signIn()}
      >
        ログインする
      </button>
    </>
  );
}
