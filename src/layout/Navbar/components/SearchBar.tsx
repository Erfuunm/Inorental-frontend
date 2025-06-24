import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  isScrolled: boolean;
}

function SearchBar({ isScrolled }: SearchBarProps) {
  return (
    <div
      className={`${
        isScrolled ? "mt-5 px-4 relative w-fit mx-auto" : "px-2"
      } hidden md:flex justify-center transition-all`}
    >
      <div
        className={`flex ${
          isScrolled ? "w-fit" : "w-full"
        } rounded-full shadow-xl border transition-all duration-500 border-gray-200 overflow-hidden divide-x divide-gray-200 max-w-3xl text-sm font-medium`}
      >
        <div className="px-6 py-3 flex flex-col justify-center flex-1 cursor-pointer hover:bg-gray-200 transition-all">
          <div className={`${isScrolled && "hidden"} text-gray-500`}>Where</div>
          <div
            className={`${
              isScrolled && "text-base"
            } transition-all text-black font-semibold`}
          >
            {isScrolled ? "Any Where" : "Search destinations"}
          </div>
        </div>
        <div className="px-6 py-3 flex flex-col justify-center cursor-pointer hover:bg-gray-200 transition-all">
          <div className={`${isScrolled && "hidden"} text-gray-500`}>
            Check in
          </div>
          <div
            className={`${
              isScrolled && "text-base"
            } transition-all text-black font-semibold`}
          >
            {isScrolled ? "Any Where" : "Add dates"}
          </div>
        </div>
        <div className="px-6 py-3 flex flex-col justify-center cursor-pointer hover:bg-gray-200 transition-all">
          <div className={`${isScrolled && "hidden"} text-gray-500`}>
            Check out
          </div>
          <div
            className={`${
              isScrolled && "text-base"
            } transition-all text-black font-semibold`}
          >
            Add dates
          </div>
        </div>
        <div className="px-6 py-3 flex flex-none cursor-pointer hover:bg-gray-200 transition-all items-center">
          <div className="mr-4">
            <div className={`${isScrolled && "hidden"} text-gray-500`}>Who</div>
            <div
              className={`${
                isScrolled && "text-base"
              } transition-all text-black font-semibold`}
            >
              Add guests
            </div>
          </div>
          <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
            <FaSearch />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
