import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBed, FaBath, FaUserFriends, FaHeart, FaShare } from "react-icons/fa";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useApi } from "../../../contexts/ApiProvider";
import toast from "react-hot-toast";
import type { House } from "../../../types/property";
import ReservationModal from "../../../components/ReservationModal/ReservationModal";
import RulesModal from "../../../components/Modal/RulesModal";

interface Review {
  review_id: number;
  guest: {
    username: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

function HouseDetailPage() {
  const { id } = useParams();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
const handleRulesAccepted = () => {
  setIsRulesModalOpen(false);
  setIsReserveModalOpen(true);
};


  const [house, setHouse] = useState<House | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const api = useApi();

  const fetchHouseDetail = async () => {
  try {
    const response = await api.uget(`/api/properties/${id}`);
    if (response.ok && response.body) {
      setHouse(response.body);
    } else {
      toast.error("Error fetching house data");
    }
  } catch (error) {
    toast.error("Failed to fetch House Data!");
  } finally {
    setIsLoading(false);
  }
};


  const fetchReviews = async () => {
    try {
      debugger
      const response = await api.uget(`/api/reviews/${id}/`);
      if (response.ok && response.body) {
        // Handle single review object by wrapping it in an array
        setReviews(Array.isArray(response.body) ? response.body : [response.body]);
      } else {
        toast.error("Error fetching reviews");
      }
    } catch (error) {
      toast.error("Failed to fetch reviews!");
    }
  };

  useEffect(() => {
    fetchHouseDetail();
    fetchReviews();
  }, [id, api]);

 if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
    </div>
  );
}

if (!house) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600">House not found</p>
    </div>
  );
}


  const pricePerNight = parseFloat(house.price_per_night);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mt-24">
      {/* Title and Buttons */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {house.title}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaHeart
                className={`text-xl ${
                  isFavorite ? "text-red-500" : "text-gray-400"
                }`}
              />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaShare className="text-xl text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600 mt-2">
          <span>
            {house.address_city}, {house.address_country}
          </span>
        </div>
      </div>

      {/* Main Image */}
      <div className="mb-6 sm:mb-12 relative group z-0">
        <img
          src={house.photos[0]?.image ?? "/placeholder.jpg"}
          alt={house.title}
          className="w-full h-[300px] sm:h-[500px] object-cover rounded-2xl"
        />
        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <BsArrowLeft className="text-xl" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <BsArrowRight className="text-xl" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Host Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 sm:pb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                {house.host.first_name[0]}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Hosted by {house.host.username} {house.host.last_name}
                </h2>
              </div>
            </div>
            <button className="w-full sm:w-auto px-6 py-2 border rounded-lg hover:bg-gray-50 transition-all">
              Contact host
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 border-b pb-6 sm:pb-8">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaUserFriends className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-base sm:text-lg">
                  {house.max_guests} guests
                </p>
                <p className="text-sm text-gray-600">Maximum occupancy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaBed className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-base sm:text-lg">
                  {house.num_bedrooms ?? 0} bedrooms
                </p>
                <p className="text-sm text-gray-600">
                  {house.num_beds ?? 0} beds
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaBath className="text-orange-500 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-base sm:text-lg">
                  {house.num_bathrooms ?? 0} baths
                </p>
                <p className="text-sm text-gray-600">Full bathrooms</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b pb-6 sm:pb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              About this place
            </h2>
            <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed">
              {house.description}
            </p>
          </div>

          {/* Full Address */}
          <div className="border-b pb-6 sm:pb-8">
            <h3 className="text-lg font-semibold mb-2">Full Address</h3>
            <p className="text-sm text-gray-600">{house.address_street}</p>
            <p className="text-sm text-gray-600">
              {house.address_city}, {house.address_state},{" "}
              {house.address_country}
            </p>
            <p className="text-sm text-gray-600">{house.address_zip_code}</p>
          </div>

          {/* Coordinates */}
          {house.latitude && house.longitude && (
            <div className="border-b pb-6 sm:pb-8">
              <h3 className="text-lg font-semibold mb-2">
                Location Coordinates
              </h3>
              <p className="text-sm text-gray-600">
                Latitude: {house.latitude}
              </p>
              <p className="text-sm text-gray-600">
                Longitude: {house.longitude}
              </p>
            </div>
          )}

          {/* Availability */}
          <div className="border-b pb-6 sm:pb-8">
            <h3 className="text-lg font-semibold mb-2">Availability</h3>
            {house.availabilities.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {house.availabilities.map((a, index) => (
                  <li key={index}>
                    {a.start_date} → {a.end_date}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No availability listed</p>
            )}
          </div>

          {/* Reviews */}
          <div className="border-b pb-6 sm:pb-8">
            <h3 className="text-lg font-semibold mb-4">Reviews</h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.review_id} className=" pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                        {review.guest.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {review.guest.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border rounded-2xl p-4 sm:p-6 shadow-lg bg-white">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <span className="text-2xl sm:text-3xl font-bold">
                  ${pricePerNight}
                </span>
                <span className="text-sm sm:text-base text-gray-600">
                  {" "}
                  / night
                </span>
              </div>
            </div>

           <button
  onClick={() => setIsRulesModalOpen(true)}
  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
>
  Reserve
</button>


            <p className="text-center text-sm sm:text-base text-gray-600 mt-4">
              You won't be charged yet
            </p>

            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>${pricePerNight} x 5 nights</span>
                <span>${(pricePerNight * 5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${(pricePerNight * 0.12).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                <span>Total before taxes</span>
                <span>
                  ${(pricePerNight * 5 + pricePerNight * 0.12).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RulesModal
  isOpen={isRulesModalOpen}
  onClose={() => setIsRulesModalOpen(false)}
  onAccept={handleRulesAccepted}
  rules={`• No smoking inside the property.
• Pets are not allowed.
• Please respect quiet hours after 10 PM.
• Check-out is before 11:00 AM.
• Any damage to property will be charged.`}

/>

<ReservationModal
  isOpen={isReserveModalOpen}
  onClose={() => setIsReserveModalOpen(false)}
  house={house}
        pricePerNight={pricePerNight}
  // ... بقیه props مودال رزرو
/>


      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        house={house}
        pricePerNight={pricePerNight}
      />
    </div>
  );
}

export default HouseDetailPage;