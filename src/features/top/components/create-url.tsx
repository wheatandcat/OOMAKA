"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { api } from "~/trpc/react";

export function CreateUrl() {
  const router = useRouter();

  const createMutation = api.url.create.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      window.localStorage.setItem("URL_ID", data.id);
      router.push(`/schedule/${data.id}`);
    },
  });

  useEffect(() => {
    const check = () => {
      const res: string | null = window.localStorage.getItem("URL_ID");
      if (res) {
        router.push(`/schedule/${res}`);
      }
    };

    void check();
  }, [router]);

  const onCreateURL = useCallback(() => {
    createMutation.mutate({ userId: "" });
  }, [createMutation]);

  return (
    <>
      <button
        className="w-72 rounded-full bg-green-500 px-10 py-4 font-semibold text-white no-underline transition hover:bg-green-300"
        onClick={onCreateURL}
      >
        新しいカレンダーを作る
      </button>
      <br />
      <button
        className="my-3 w-72 rounded-full bg-blue-500 px-10 py-3  font-semibold text-white no-underline transition hover:bg-blue-300"
        onClick={() => void signIn()}
      >
        ログイン
      </button>
    </>
  );
}
