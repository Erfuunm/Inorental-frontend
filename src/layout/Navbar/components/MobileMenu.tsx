import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCompass, FaUser } from "react-icons/fa";

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaHome size={20} />, label: "Home", path: "/" },
    { icon: <FaCompass size={20} />, label: "Explore", path: "/Explore" },
    { icon: <FaUser size={20} />, label: "Login", path: "/login" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={e => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigate(item.path)}
                      className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-colors"
                    >
                      {item.icon}
                      
                      <span>{item.label}</span>

                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileMenu; 