import { useEffect, useState } from "react";

// ウィンドウ横幅を追跡するカスタムフック
const useWindowWidth = () => {
  const [width, setWidth] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth : 0;
  });

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // コンポーネントのアンマウント時にイベントリスナーをクリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};

export default useWindowWidth;
