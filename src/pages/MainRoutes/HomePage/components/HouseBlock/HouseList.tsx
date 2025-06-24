import { useEffect, useRef, useState } from "react";
import useHorizontalTouchScroll from "../../../../../utils/hooks/useTouchScroll";
import { FaArrowRight } from "react-icons/fa";
import HouseCard from "./HouseCard";
import { useApi } from "../../../../../contexts/ApiProvider";
import toast from "react-hot-toast";

interface HouseListProps {
  title: string;
  city: string;
}

interface House {
  id: number;
  title: string;
  thumbnail: string;
  location: {
    address: string;
  };
}

function HouseList({ title, city }: HouseListProps) {
  const containerRef = useRef(null);
  useHorizontalTouchScroll(null, null, containerRef);
  const [houseData, setHouses] = useState<House[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const api = useApi();

  const fetchHouses = async () => {
    setLoadingPage(true);
    try {
      // debugger;
      let url = `/api/properties/`;
      const response = await api.uget(url);
      setLoadingPage(false);

      if (response.ok && response.body) {
        const data = response.body.results;
        // Transform API data to match HouseCard expected structure
        const transformedData = data.map((item: any) => ({
          id: item.property_id,
          title: item.title,
          thumbnail: item.photos[0]?.image || "https://via.placeholder.com/150", // Fallback image if no photo
          location: {
            address: `${item.address_street}, ${item.address_city}, ${item.address_country}`,
          },
        }));
        setHouses(transformedData);
      } else {
        toast.error("Failed to fetch Houses");
      }
    } catch (error) {
      setLoadingPage(false);
      toast.error("Failed to fetch Houses");
    }
  };

  useEffect(() => {
    fetchHouses();
  }, [city]); // Added city as dependency to refetch when city changes

  return (
    <div className="py-2 my-6 space-y-6">
      <h4 className="text-xl font-semibold md:text-4xl px-4 text-gray-800 flex items-center">
        {title}
        <p className="text-xl mx-2">
          <FaArrowRight />
        </p>
      </h4>

      {loadingPage ? (
        <div className="px-4">Loading...</div>
      ) : houseData.length === 0 ? (
        <div className="px-4">No houses found for {city}</div>
      ) : (
        <div
          ref={containerRef}
          className="flex house-block px-4 cursor-grab gap-x-2 items-center overflow-auto hidden-scroll-bar space-x-6"
        >
          {houseData.map((house: House) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HouseList;
