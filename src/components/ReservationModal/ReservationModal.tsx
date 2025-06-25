import { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import type { House } from "../../types/property";
import NotificationModal from "../Modal/NotificationModal";
import { useApi } from "../../contexts/ApiProvider";


interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House;
  pricePerNight: number;
}

function ReservationModal({ isOpen, onClose, house, pricePerNight }: ReservationModalProps) {
  const api = useApi();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [showNotification, setShowNotification] = useState(false);
  const [platformSelected, setPlatformSelected] = useState<"whatsapp" | "sms" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const calculateTotalPrice = () => {
  if (!formData.checkIn || !formData.checkOut) return 0;
  const checkInDate = new Date(formData.checkIn);
  const checkOutDate = new Date(formData.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
  const serviceFee = pricePerNight * nights * 0.12;
  return pricePerNight * nights + serviceFee; // Remove .toFixed(2) to return a number
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  const totalPrice = calculateTotalPrice();
  if (totalPrice === 0) {
    setError("Please select valid check-in and check-out dates.");
    return;
  }

  const body = {
    property_id: house.property_id,
    check_in_date: formData.checkIn,
    check_out_date: formData.checkOut,
    total_price: totalPrice,
    num_guests: formData.guests,
  };

  try {
    console.log(house);
    const res = await api.post('/api/bookings/create_booking/', body);
    if (res.status === 201) {
      setShowNotification(true);
    } else {
      setError("Failed to create booking. Please try again.");
    }
  } catch (err) {
    setError("An error occurred while creating the booking.");
  }
};

  const handleNotificationClose = () => {
    setShowNotification(false);
    setPlatformSelected(null);
    setFormData({
      checkIn: "",
      checkOut: "",
      guests: 1,
    });
    setError(null);
    onClose();
  };

  const handleSelectPlatform = (platform: "whatsapp" | "sms") => {
    setPlatformSelected(platform);
    setTimeout(() => {
      handleNotificationClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-orange-100 rounded-full"
          >
            <FaTimes className="text-xl text-orange-500" />
          </button>

          <h2 className="text-2xl font-bold mb-4 text-orange-600">Complete Your Reservation</h2>
          <p className="text-sm text-gray-600 mb-4">{house.title}</p>

          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg focus:border-orange-500 focus:ring-orange-500"
                required
              >
                {[...Array(house.max_guests)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">${pricePerNight} x {formData.checkIn && formData.checkOut ? Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24)) : 0} nights</span>
                <span className="text-orange-600">${formData.checkIn && formData.checkOut ? (pricePerNight * Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24))).toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Service fee</span>
                <span className="text-orange-600">${formData.checkIn && formData.checkOut ? (pricePerNight * Math.ceil((new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) / (1000 * 3600 * 24)) * 0.12).toFixed(2) : "0.00"}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total before taxes</span>
                <span className="text-orange-600">${calculateTotalPrice()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Confirm Reservation
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Stripe payment processing will be added here
          </p>
        </div>
      </div>
      <NotificationModal
        isOpen={showNotification}
        onClose={handleNotificationClose}
        onSelectPlatform={handleSelectPlatform}
      />
      {platformSelected && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-white border border-orange-200 rounded-xl px-8 py-6 shadow-lg flex flex-col items-center animate-fade-in">
            <FaCheckCircle className="text-4xl text-orange-500 mb-2" />
            <div className="text-lg font-semibold text-orange-600 mb-1">
              Sent via {platformSelected === "whatsapp" ? "WhatsApp" : "SMS"}!
            </div>
            <div className="text-gray-700 text-sm">Your reservation details have been sent.</div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReservationModal;