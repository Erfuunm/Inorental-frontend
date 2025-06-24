import { FaWhatsapp, FaSms, FaTimes, FaCheckCircle } from "react-icons/fa";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlatform: (platform: "whatsapp" | "sms") => void;
}

function NotificationModal({ isOpen, onClose, onSelectPlatform }: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-orange-100 rounded-full"
        >
          <FaTimes className="text-xl text-orange-500" />
        </button>
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-5xl text-orange-500 mb-3" />
          <h2 className="text-2xl font-bold mb-2 text-orange-600 text-center">Reservation Successful!</h2>
          <p className="text-center text-gray-700 mb-6">
            Your reservation has been submitted successfully.<br />
            How would you like to receive your reservation details?
          </p>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => onSelectPlatform("whatsapp")}
              className="flex flex-col items-center hover:scale-110 transition"
            >
              <FaWhatsapp className="text-4xl text-green-500" />
              <span className="text-xs mt-1 text-gray-700">WhatsApp</span>
            </button>
            <button
              onClick={() => onSelectPlatform("sms")}
              className="flex flex-col items-center hover:scale-110 transition"
            >
              <FaSms className="text-4xl text-orange-400" />
              <span className="text-xs mt-1 text-gray-700">SMS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;