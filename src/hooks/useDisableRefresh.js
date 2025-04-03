import { useEffect } from "react";

const useDisablePullToRefresh = () => {
  useEffect(() => {
    const preventRefresh = (e) => {
      if (e.touches[0].clientY < 50) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventRefresh, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventRefresh);
    };
  }, []);
};

export default useDisablePullToRefresh;
