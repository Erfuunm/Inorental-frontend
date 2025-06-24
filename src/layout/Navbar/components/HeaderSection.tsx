import { useState, useEffect, useRef } from "react";

import { FaGlobe, FaUser, FaSignOutAlt } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginModal from "../../../components/LoginModal/LoginModal";
import SignupModal from "../../../components/SignupModal/SignupModal";
import { useAuth } from "../../../contexts/AuthContext";
import useDisableScroll from "../../../utils/hooks/useDisableScroll";

interface HeaderSectionProps {
  isScrolled: boolean;
}

function HeaderSection({ isScrolled }: HeaderSectionProps) {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null); // Ref for dropdown container
  const location = useLocation();
  const navigate = useNavigate();
  const isHouseDetailsPage = location.pathname.includes("/house/");
  const { user, logout } = useAuth();
  useDisableScroll(isLoginModalOpen || isSignupModalOpen);

  // Check authentication status and username from localStorage or AuthContext
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUsername = localStorage.getItem("username");

    if (user) {
      setIsAuthenticated(true);
      setUsername(user.username || storedUsername || "User");
    } else {
      setIsAuthenticated(storedAuth === "true");
      setUsername(storedUsername || "User");
    }
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLoginClick = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSignupClick = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <div
        className={`${
          isScrolled
            ? isHouseDetailsPage
              ? "absolute w-full bg-white shadow-md z-50"
              : "absolute w-full"
            : "relative"
        } md:flex items-center hidden justify-between px-6 py-4 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="text-orange-600 font-bold text-xl flex items-end gap-x-2 justify-between">
          <p>
            <img src="/logo.png" className="size-10" alt="InoRental logo" />
          </p>
          <p className="text-3xl font-bold">InoRental</p>
        </div>



        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <div
                className="flex items-center gap-2 bg-gray-100 rounded-full py-1 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label={`Profile for ${username}`}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <FaUser className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 mr-4">
                  {username}
                </span>
              </div>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      navigate("/user-panel");
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="mr-2" />
                    My Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-orange-500 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={handleSignupClick}
                className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Sign up
              </button>
            </>
          )}
          <FaGlobe className="text-gray-700 cursor-pointer" />
          {/* <FaBars className="text-gray-600 cursor-pointer" /> */}
        </div>
      </div>

      <div>
        <Toaster />
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModals}
        onOpenSignup={handleSignupClick}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseModals}
        onOpenLogin={handleLoginClick}
      />
    </>
  );
}

export default HeaderSection;
