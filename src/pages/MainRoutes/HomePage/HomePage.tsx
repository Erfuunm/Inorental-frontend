import { v4 } from "uuid";
import HouseList from "./components/HouseBlock/HouseList";

function HomePage() {
  return (
    <div className="">
      <div className="space-y-12 max-w-[99%] mx-auto mt-[7%] mb-[4%]">
        <HouseList key={v4()} title="Our Popular homes" city="Paris" />
      </div>
    </div>
  );
}

export default HomePage;
