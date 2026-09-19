import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-1 text-ink dark:text-slate-100">Create account</h2>
        <p className="text-center text-sm text-ink/60 dark:text-slate-400 mb-6">Join MedKart in seconds</p>

        {[
          { label: "Full Name", name: "name", type: "text", required: true },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Password", name: "password", type: "password", required: true },
          { label: "Phone", name: "phone", type: "text", required: false },
          { label: "Address", name: "address", type: "text", required: false },
        ].map((field) => (
          <div key={field.name} className="mb-4">
            <label className="text-sm font-medium text-ink/80 dark:text-slate-300">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              required={field.required}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4 text-ink/60 dark:text-slate-400">
          Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
