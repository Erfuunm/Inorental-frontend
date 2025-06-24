import { fakeArray } from "../../../../utils/constants";

function PropertyListLoading() {
  return (
    <>
      {fakeArray(15).map((_, index) => (
        <div key={index} className="w-full h-32 animate-pulse flex gap-2 flex-none p-2 md:px-4 md:py-2">
          {/* Thumbnail */}
          <div className="w-28 md:w-36 flex-none h-full bg-gray-300 rounded-xl"></div>
          {/* Property info */}
          <div className="px-1.5 py-2 flex flex-col md:w-1/4 w-3/4 justify-around">
            <p className="md:text-lg font-bold w-2/3 h-2 rounded-xl bg-gray-300"></p>
            <p className="md:text-lg font-bold w-1/3 h-2 rounded-xl bg-gray-300"></p>
            <p className="md:text-lg font-bold w-2/3 h-2 rounded-xl bg-gray-300"></p>
          </div>
        </div>
      ))}
    </>
  );
}

export default PropertyListLoading;