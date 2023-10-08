import * as React from "react";
import Link from "next/link";

const Header: React.FC = () => (
  <div className="container relative mx-auto flex max-w-screen-xl justify-between gap-12 px-4 sm:px-0">
    <div className="py-2">
      <Link href="/">
        <div className="mini-logo-title">年間スケジュール、まとめるなら</div>
        <div className="logo-title text-2xl font-bold">OOMAKA</div>
      </Link>
    </div>
  </div>
);

export default Header;
