// LoginModal.tsx
import { useState } from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
}

function LoginModal({ isOpen, onClose, onOpenSignup }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      onClose();
      navigate("/"); // Adjust based on your routing needs
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
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
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="text-gray-600 mt-2">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-4 py-3 border border-orange-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 backdrop-blur-sm transition-all"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-orange-200 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm text-orange-500 hover:text-orange-600 transition-colors">
              Forgot password?
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
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            onClick={onOpenSignup}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;