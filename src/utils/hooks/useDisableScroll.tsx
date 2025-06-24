import { useEffect } from "react";

const useDisableScroll = (condition: any) => {
  // hidden window scroll-bar on mount
  useEffect(() => {
    document.body.style.overflow = !condition ? "auto" : "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [condition]);
};

export default useDisableScroll;
