import { memo } from "react";

type Errors = Record<string, string>;

const errors: Errors = {
  Signin: "別のアカウントでサインインしてみてください。",
  OAuthSignin: "別のアカウントでOAuthサインインを試してみてください。",
  OAuthCallback: "別のアカウントでOAuthコールバックを試してみてください。",
  OAuthCreateAccount:
    "別のアカウントでメールアカウント作成を試してみてください。",
  EmailCreateAccount:
    "別のアカウントでメールアカウント作成を試してみてください。",
  Callback: "別のアカウントでメールアカウント作成を試してみてください。",
  OAuthAccountNotLinked:
    "ログインに使用されているアカウントと同じアカウントではサインインできません。",
  EmailSignin: "メールアドレスを確認してください。",
  CredentialsSignin:
    "サインインに失敗しました。提供した詳細が正しいことを確認してください。",
  default: "サインインできませんでした",
};

type Props = {
  error: string;
};

const SignInError = ({ error }: Props) => {
  const errorMessage = String(error && (errors[error] ?? errors.default));
  return (
    <div
      className="relative w-80 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 text-xs"
      role="alert"
    >
      <div>{errorMessage}</div>
    </div>
  );
};

export default memo(SignInError);
