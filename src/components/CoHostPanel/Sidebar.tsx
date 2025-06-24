import React, { useState } from "react";
import { Menu } from "lucide-react";
import useDisableScroll from "../../utils/hooks/useDisableScroll";

interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string;
  modalId?: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  toggleIcon?: React.ReactNode;
  sidebarId?: string;
  onOpenModal?: (modalId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems = [],
  toggleIcon,
  sidebarId = "cohost-sidebar",
  onOpenModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  useDisableScroll(isOpen);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleItemClick = (item: MenuItem) => {
    if (item.modalId && onOpenModal) {
      onOpenModal(item.modalId);
      setIsOpen(false); // close sidebar on mobile after click
    }
  };

  return (
    <>
      <button
        type="button"
        aria-controls={sidebarId}
        aria-expanded={isOpen}
        onClick={toggleSidebar}
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-orange-100 focus:outline-none"
      >
        <span className="sr-only">Open sidebar</span>
        {toggleIcon || <Menu className="w-6 h-6" />}
      </button>

      <aside
        id={sidebarId}
        className={`fixed top-0 left-0 transition-all duration-300 z-40 w-64 min-h-screen h-auto bg-orange-500 sm:static sm:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white text-left">
              Co-Host Panel
            </h2>
          </div>
          <ul className="space-y-2 font-medium">
            {menuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <button
                  onClick={() => handleItemClick(item)}
                  className="flex items-center w-full p-2 text-white rounded-lg hover:bg-orange-600 group transition-colors text-left"
                >
                  {item.icon && (
                    <span className="w-5 h-5 mr-3 text-orange-100 group-hover:text-white">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-orange-500 bg-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div
        onClick={() => setIsOpen(false)}
        className={`${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        } fixed inset-0 backdrop-blur transition-all right-0`}
      ></div>
    </>
  );
};

export default Sidebar;