import { memo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";
import useWindowWidth from "~/hooks/useWindowWidth";

type Props = {
  id: string;
  userId: string;
  isPassword: boolean;
};

type Input = {
  isPassword: boolean;
  password: string;
};

const PublicationSetting = (props: Props) => {
  const [show, setShow] = useState(false);
  const width = useWindowWidth();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      isPassword: false,
      password: "",
    },
  });
  const isPassword = watch("isPassword");
  const [inputPassword, setInputPassword] = useState(!props.isPassword);

  const updateMutation = api.url.update.useMutation({
    onError: (error) => {
      toast.error(`更新に失敗しました。error:${error.message}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onSuccess: () => {
      let text = "パスワードを設定しました";
      if (!inputPassword) {
        text = "誰でも閲覧可能にしました";
        setInputPassword(true);
      } else {
        setInputPassword(false);
      }

      toast.success(text, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  const onSubmit: SubmitHandler<Input> = (data) => {
    updateMutation.mutate({
      id: props.id,
      userId: props.userId,
      password: data.password,
    });
  };

  const onReset = () => {
    updateMutation.mutate({
      id: props.id,
      userId: props.userId,
      password: "",
    });
  };

  const sp = width > 767 ? false : true;
  const height = sp ? "60px" : "40px";

  return (
    <div className="no-print">
      <div
        className="onClick={handleClick} flex cursor-pointer text-sm font-bold"
        onClick={() => setShow(!show)}
      >
        <div
          className={` ${
            show ? "rotate-90" : "rotate-0"
          } transition-transform duration-300 ease-in-out`}
        >
          ▶
        </div>
        公開範囲設定
      </div>

      <div
        className={`transition-height overflow-hidden duration-500 ease-in-out`}
        style={{ height: show ? height : "0" }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-1 flex flex-col items-start sm:flex-row sm:items-center">
            <div className="flex flex-col items-start sm:flex-row sm:items-center ">
              {inputPassword && (
                <>
                  <div className="mb-1 mr-2 flex items-center sm:mb-0">
                    <input
                      id="isPassword"
                      type="checkbox"
                      className="mt-[0.1rem] h-4 w-4 rounded border-gray-300 bg-gray-100 text-green-600 accent-green-600"
                      {...register("isPassword")}
                    />
                    <label
                      htmlFor="isPassword"
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      パスワード設定
                    </label>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <div className="relative">
                        <input
                          data-tooltip-target="tooltip-bottom"
                          data-tooltip-placement="bottom"
                          className="focus:shadow-outline w-60 appearance-none border bg-white py-[2px] pl-1 leading-tight text-gray-700 focus:outline-none disabled:bg-gray-200"
                          type="password"
                          id="password"
                          placeholder={isPassword ? "" : "パスワードなし"}
                          disabled={!isPassword}
                          enterKeyHint="done"
                          {...register("password", {
                            required: true,
                            minLength: {
                              value: 4,
                              message:
                                "パスワードは4文字以上で入力してください",
                            },
                            maxLength: {
                              value: 30,
                              message:
                                "パスワードは30文字以下で入力してください",
                            },
                          })}
                        />
                        {errors.password?.message && (
                          <div className="absolute left-0 top-8 z-10 inline-block rounded-lg bg-red-500 px-3  py-2 text-xs font-medium text-white opacity-95  shadow-sm">
                            {errors.password.message}
                            <div
                              className="absolute -top-2 left-1/4 -translate-x-1/2 bg-red-500"
                              style={{
                                height: " calc(tan(40deg) * 40px / 2)",
                                width: "20px",
                                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="ml-1 rounded border border-gray-400 bg-gray-100 text-center text-xs no-underline hover:bg-gray-200 disabled:opacity-50"
                        style={{
                          padding: sp ? "0.25rem 0.5rem" : "0.2rem 0.5rem",
                        }}
                        disabled={!!errors.password?.message}
                      >
                        設定
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
        {!inputPassword && (
          <div className="flex items-center">
            <div>
              <button
                className="rounded border border-gray-400 bg-gray-100 text-center text-xs no-underline hover:bg-gray-200 disabled:opacity-50"
                style={{
                  padding: "0.1rem 0.5rem",
                }}
                onClick={() => setInputPassword(true)}
              >
                パスワードを変更する
              </button>
            </div>
            <div className="ml-2">
              <button
                className="rounded border border-gray-400 bg-gray-100 text-center text-xs no-underline hover:bg-gray-200 disabled:opacity-50"
                style={{
                  padding: "0.1rem 0.5rem",
                }}
                onClick={() => onReset()}
              >
                誰でも閲覧可能にする
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PublicationSetting);
