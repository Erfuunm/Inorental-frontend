import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";

function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isHouseDetailsPage = location.pathname.includes("/house/");

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && (
        <div className={`${isHouseDetailsPage ? "relative" : ""}`}>
          <Navbar />
        </div>
      )}
      <main
        className={`${isAuthPage ? "" : isHouseDetailsPage ? "pt-0" : "pt-24"}`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
