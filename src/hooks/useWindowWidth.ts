import { useState, useEffect } from "react";

// ウィンドウ横幅を追跡するカスタムフック
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

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
