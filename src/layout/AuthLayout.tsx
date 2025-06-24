import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

function AuthLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');

  if (!isAuthPage) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Navbar />
      </div>

      {/* Main content with proper spacing for fixed header */}
      <div className="h-full pt-28 md:pt-52">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout; 