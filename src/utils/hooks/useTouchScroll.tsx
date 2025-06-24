import { useState, useEffect } from "react";

function useHorizontalTouchScroll(
  elClass: string | null,
  renderTime: number | null,
  elRef: React.RefObject<HTMLDivElement> | any
): HTMLElement | null {
  const [isDown, setIsDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let containerRef: HTMLElement | null = null;

    if (elRef.current) {
      containerRef = elRef.current;
    } else if (elClass !== null) {
      const found = document.querySelector(elClass);
      if (found instanceof HTMLElement) {
        containerRef = found;
      }
    }

    setContainer(containerRef);
  }, [elClass, renderTime, elRef]);

  useEffect(() => {
    if (!container) return;

    const setWalk = (e: MouseEvent) => {
      setIsDown(true);
      container.classList.add("active");
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
    };
    container.addEventListener("mousedown", setWalk);

    const removeWalk = () => {
      setIsDown(false);
      container.classList.remove("active");
    };
    container.addEventListener("mouseleave", removeWalk);
    container.addEventListener("mouseup", removeWalk);

    const walkScroll = (e: MouseEvent) => {
      if (!isDown || !container.classList.contains("active")) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1;
      container.scrollLeft = scrollLeft - walk;
    };
    container.addEventListener("mousemove", walkScroll);

    return () => {
      container.removeEventListener("mousedown", setWalk);
      container.removeEventListener("mouseleave", removeWalk);
      container.removeEventListener("mouseup", removeWalk);
      container.removeEventListener("mousemove", walkScroll);
    };
  }, [container, isDown, startX, scrollLeft]);

  return container;
}

export default useHorizontalTouchScroll;
