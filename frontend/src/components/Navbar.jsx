import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems, clearCart } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/login");
  };

  // Shrink navbar on scroll for a more premium, app-like feel
  useEffect(() => {
    const nav = navRef.current;
    let lastState = false;

    const onScroll = () => {
      const scrolled = window.scrollY > 24;
      if (scrolled !== lastState) {
        lastState = scrolled;
        gsap.to(nav, {
          paddingTop: scrolled ? 8 : 14,
          paddingBottom: scrolled ? 8 : 14,
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 2px rgba(0,0,0,0.04)",
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm sticky top-0 z-30 py-3.5 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-display font-bold text-xl">
          <span className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">+</span>
          MedKart
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-ink dark:text-slate-200">
          <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 hidden sm:inline">Medicines</Link>

          {user && (
            <Link to="/orders" className="hover:text-brand-600 dark:hover:text-brand-400 hidden sm:inline">My Orders</Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400 hidden sm:inline">Admin Panel</Link>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-accent-400 hover:scale-105 transition"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link to="/cart" className="relative hover:text-brand-600 dark:hover:text-brand-400">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-ink/70 dark:text-slate-400 hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400">Login</Link>
              <Link
                to="/register"
                className="bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
