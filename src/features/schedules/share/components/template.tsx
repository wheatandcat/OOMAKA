"use client";

import type { Schedule } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import Layout from "~/components/Layout/Layout";
import Items from "~/features/schedules/components/Items";
import Pagination from "~/features/schedules/components/Pagination";
import Period from "~/features/schedules/components/Period";
import dayjs from "~/utils/dayjs";
import { getScheduleInMonth, monthItems } from "~/utils/schedule";

type Props = {
	id: string;
	schedules: Schedule[];
};

export function Template(props: Props) {
	const [startDate, setStartDate] = useState(dayjs());

	const months = monthItems(
		Number(startDate.format("M")),
		Number(startDate.year()),
	);

	const onShare = useCallback(async () => {
		await global.navigator.clipboard.writeText(`${window.location.href}/share`);
		toast.success("URLをコピーしました！", {
			position: "top-center",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
		});
	}, []);

	const onPrint = useCallback(() => {
		setTimeout(() => window.print(), 100);
	}, []);

	return (
		<Layout>
			<main className="container mx-auto max-w-screen-xl gap-12 pt-3">
				<div className="no-print">
					<div
						className="absolute top-0 right-0 hidden sm:block"
						onClick={() => void onPrint()}
					>
						<div className="flex w-10 cursor-pointer flex-col items-center pt-3 hover:bg-blue-100 sm:w-14 sm:text-xl">
							🖨️
							<div className="hidden text-center text-gray-500 text-xxs sm:block">
								印刷
							</div>
						</div>
					</div>
				</div>
				<div className="relative hidden justify-between sm:flex">
					<Period
						startDate={startDate.format()}
						endDate={startDate.add(1, "years").format()}
					/>
					<Pagination
						onNext={() => setStartDate(startDate.add(1, "months"))}
						onPrev={() => setStartDate(startDate.subtract(1, "months"))}
					/>
				</div>

				<div className="flex flex-col flex-nowrap justify-center pt-0 sm:flex-row sm:flex-wrap sm:justify-start sm:pt-10">
					{months.map((item, index) => (
						<div
							key={index}
							className="item-container px-0 pb-6 sm:pr-16 sm:pb-16"
						>
							<Items
								share
								urlId={String(props.id)}
								date={item}
								defaultItems={getScheduleInMonth(item, props.schedules ?? [])}
							/>
						</div>
					))}
				</div>
				<div className="no-print mb-10 flex justify-center">
					<button
						type="button"
						className="mr-1 mb-1 rounded-md border border-gray-700 px-5 py-2.5 text-center font-medium text-blue-700 text-sm hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-500 dark:text-gray-500 dark:focus:ring-gray-800 dark:hover:bg-gray-500 dark:hover:text-white"
						onClick={() => void onShare()}
					>
						リンクをコピー
					</button>
				</div>
			</main>
		</Layout>
	);
}
