import { memo } from "react";

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

const Pagination = (props: Props) => {
  return (
    <div className="rounded-lg">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center rounded-l-lg border border-r-0 p-1 leading-none transition duration-100 ease-in-out hover:bg-gray-100"
        onClick={props.onPrev}
      >
        <svg
          className="inline-flex h-6 w-6 leading-none text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="inline-flex h-6 border-r"></div>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center rounded-r-lg border border-l-0 p-1 leading-none transition duration-100 ease-in-out hover:bg-gray-100"
        onClick={props.onNext}
      >
        <svg
          className="inline-flex h-6 w-6 leading-none text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default memo(Pagination);
