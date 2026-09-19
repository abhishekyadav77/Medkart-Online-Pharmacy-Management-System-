import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-1 text-ink dark:text-slate-100">Welcome back</h2>
        <p className="text-center text-sm text-ink/60 dark:text-slate-400 mb-6">Login to your MedKart account</p>

        <label className="text-sm font-medium text-ink/80 dark:text-slate-300">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mt-1 mb-4 px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="you@example.com"
        />

        <label className="text-sm font-medium text-ink/80 dark:text-slate-300">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mt-1 mb-6 px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4 text-ink/60 dark:text-slate-400">
          Don't have an account? <Link to="/register" className="text-brand-600 dark:text-brand-400 font-medium">Sign up</Link>
        </p>

        <p className="text-xs text-center mt-3 text-ink/40 dark:text-slate-500">
          Admin demo: admin@pharmacy.com / admin123
        </p>
      </form>
    </div>
  );
};

export default Login;
