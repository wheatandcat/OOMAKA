import Link from "next/link";
import type { FC } from "react";

const Header: FC = () => (
	<div className="no-print container relative mx-auto flex max-w-screen-xl justify-between gap-12 px-4 sm:px-0">
		<div className="py-2">
			<Link href="/">
				<div className="mini-logo-title">年間スケジュール、まとめるなら</div>
				<div className="logo-title font-bold text-2xl">OOMAKA</div>
			</Link>
		</div>
	</div>
);

export default Header;
