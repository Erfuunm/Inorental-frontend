// SignupModal.tsx
import { useState } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

function SignupModal({ isOpen, onClose, onOpenLogin }: SignupModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData.username, formData.email, formData.password, formData.firstName, formData.lastName);
      onClose();
      navigate("/"); // Adjust based on your routing needs
    } catch (error: any) {
      setError(error.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-orange-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-orange-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Create account
          </h2>
          <p className="text-gray-600 mt-2">Sign up for a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-gray-500"
            >
              {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            onClick={onOpenLogin}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;