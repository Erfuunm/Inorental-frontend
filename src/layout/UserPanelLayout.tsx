import { Outlet } from "react-router-dom";
import Sidebar from "../components/UserPanel/Sidebar";
import { Home, Settings, Bell, User, Calendar, CreditCard } from "lucide-react";

function UserPanelLayout() {
  const menuItems = [
    {
      label: "داشبورد",
      href: "/user-panel",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "پروفایل",
      href: "/user-panel/profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "رزروهای من",
      href: "/user-panel/reservations",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: "تراکنش‌ها",
      href: "/user-panel/transactions",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "اعلان‌ها",
      href: "/user-panel/notifications",
      icon: <Bell className="w-5 h-5" />,
      badge: "3",
    },
    {
      label: "تنظیمات",
      href: "/user-panel/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed right-0 top-0 h-screen">
          <Sidebar menuItems={menuItems} />
        </div>

        {/* Main Content */}
        <main className="flex-1 mr-64 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserPanelLayout; 