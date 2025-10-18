import type { FC } from "react";

const Footer: FC = () => (
  <div className="footer-text no-print container mx-auto max-w-screen-xl  gap-12 break-all px-4 py-2 leading-3 sm:px-0">
    <div className="pb-1">
      OOMAKAは1年間のスケジュールをざっくり書き出して、スケジュールを把握するwebサービスです。
    </div>
    <div className="pb-1">
      タスク1つにつき10文字、1ヶ月5件まで登録できます。
    </div>
    <div>
      ログインすると、過去のタスク閲覧や、スケジュールの限定公開ができるようになります。
    </div>
  </div>
);

export default Footer;
