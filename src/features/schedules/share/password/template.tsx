"use client";
import React, { memo, useState } from "react";
import Header from "~/components/Layout/Header";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  urlId: string;
};

type Input = {
  password: string;
};

function Template(props: Props) {
  const router = useRouter();
  const [error, setError] = useState(false);

  const { register, watch, handleSubmit } = useForm<Input>({
    defaultValues: {
      password: "",
    },
  });
  const password = watch("password");

  const checkPassword = api.url.checkPassword.useQuery(
    {
      id: props.urlId,
      password,
    },
    {
      enabled: false,
      onError: (error) => {
        console.log(error);
      },
    },
  );

  const onSubmit: SubmitHandler<Input> = async () => {
    const check = await checkPassword.refetch();
    console.log("onSubmit:", check.data);
    if (!check.data) {
      setError(true);
      return;
    }

    router.push(`/schedule/${props.urlId}/share`);
  };

  return (
    <div className="container relative mx-auto max-w-screen-xl gap-12 ">
      <Header />
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          <div className="text-xl font-bold">パスワードを入力してください</div>
          <div className="flex items-center pt-4">
            <div>
              <div className="relative">
                <input
                  data-tooltip-target="tooltip-bottom"
                  data-tooltip-placement="bottom"
                  className="focus:shadow-outline w-120 appearance-none border bg-white py-[2px] pl-1 text-xl leading-tight text-gray-700 focus:outline-none"
                  type="password"
                  id="password"
                  placeholder="パスワードを入力"
                  {...register("password")}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="ml-1 rounded border border-gray-400 bg-gray-100 text-center text-xl font-thin no-underline hover:bg-gray-200"
                style={{
                  padding: "0 0.4rem",
                }}
              >
                入力
              </button>
            </div>
          </div>
          {error && (
            <div className="pt-2 text-sm text-red-500">
              パスワードが違います
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default memo(Template);
