import { useEffect, useRef, useState } from "react";
import HeaderSection from "./components/HeaderSection";
import SearchBar from "./components/SearchBar";
import useScrolled from "../../utils/hooks/useScrolled";

export default function Navbar() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [threshold, setThreshold] = useState<number>(0);
  const isScrolled = useScrolled(threshold);

  useEffect(() => {
    if (headerRef.current) {
      setThreshold(headerRef.current.offsetHeight);
    }
  }, []);

  return (
    <header className="bg-white shadow-sm py-4 md:py-0 md:pb-4 w-full top-0 mb-4 fixed z-50">
      {/* desktop header */}
      <div ref={headerRef}>
        <HeaderSection isScrolled={isScrolled} />
      </div>
      {/* Search Bar */}
    <div className={`${!isScrolled ? '-mt-[2.7%]' : ''}`}>
        <SearchBar isScrolled={isScrolled} />
    </div>
    </header>
  );
}
