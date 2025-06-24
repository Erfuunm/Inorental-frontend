import { FaTimes, FaCheckCircle } from "react-icons/fa";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  rules: string;
}

function RulesModal({ isOpen, onClose, onAccept, rules }: RulesModalProps) {
  if (!isOpen) return null;

  const ruleItems = rules.split("\n").map((rule, index) => (
    <li key={index} className="flex items-start gap-2 text-gray-700 text-sm mb-2">
      <FaCheckCircle className="text-orange-500 mt-0.5" />
      <span>{rule.replace(/^•\s*/, "")}</span>
    </li>
  ));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <FaTimes className="text-xl text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-orange-500 mb-4">
          House Rules
        </h2>

        <ul className="mb-6">{ruleItems}</ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}

export default RulesModal;
