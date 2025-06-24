import { useState } from "react";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import type { House } from "../../types/property";
import NotificationModal from "../Modal/NotificationModal";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  house: House;
  pricePerNight: number;
}

function ReservationModal({ isOpen, onClose, house, pricePerNight }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [showNotification, setShowNotification] = useState(false);
  const [platformSelected, setPlatformSelected] = useState<"whatsapp" | "sms" | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotification(true);
  };

  const handleNotificationClose = () => {
  setShowNotification(false);
  setPlatformSelected(null);
  setFormData({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-lg focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

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
                <span className="text-gray-600">${pricePerNight} x 5 nights</span>
                <span className="text-orange-600">${(pricePerNight * 5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Service fee</span>
                <span className="text-orange-600">${(pricePerNight * 0.12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total before taxes</span>
                <span className="text-orange-600">
                  ${(pricePerNight * 5 + pricePerNight * 0.12).toFixed(2)}
                </span>
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

export default ReservationModal