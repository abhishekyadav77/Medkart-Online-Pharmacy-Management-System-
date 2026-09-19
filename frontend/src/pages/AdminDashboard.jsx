import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { IndianRupee, Package, ShoppingBag, Clock, FileImage, X } from "lucide-react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const emptyForm = {
  name: "",
  brand: "",
  category: "Other",
  description: "",
  price: "",
  mrp: "",
  stock: "",
  requiresPrescription: false,
};

const StatCard = ({ icon: Icon, label, value, tint }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${tint}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-ink/50 dark:text-slate-400">{label}</p>
      <p className="text-xl font-bold text-ink dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const chartGrid = darkMode ? "#334155" : "#eee";
  const chartTick = darkMode ? "#94a3b8" : "#6b7280";
  const [tab, setTab] = useState("analytics");
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);

  const fetchMedicines = async () => {
    const { data } = await api.get("/medicines", { params: { limit: 100 } });
    setMedicines(data.medicines);
  };

  const fetchOrders = async () => {
    const { data } = await api.get("/orders");
    setOrders(data);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMedicines(), fetchOrders()]).finally(() => setLoading(false));
  }, []);

  // ---- Analytics derived from orders + medicines (no extra backend calls needed) ----
  const analytics = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "Cancelled");
    const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingCount = orders.filter((o) => o.status === "Pending").length;

    // Top-selling medicines by quantity
    const qtyMap = {};
    activeOrders.forEach((o) => {
      o.items.forEach((item) => {
        qtyMap[item.name] = (qtyMap[item.name] || 0) + item.quantity;
      });
    });
    const topSellers = Object.entries(qtyMap)
      .map(([name, qty]) => ({ name: name.length > 16 ? name.slice(0, 16) + "…" : name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // Revenue trend — last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const revenueTrend = days.map((d) => {
      const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      const dayTotal = activeOrders
        .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { day: label, revenue: dayTotal };
    });

    return { totalRevenue, pendingCount, topSellers, revenueTrend };
  }, [orders]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        mrp: form.mrp ? Number(form.mrp) : undefined,
      };
      if (editingId) {
        await api.put(`/medicines/${editingId}`, payload);
        toast.success("Medicine updated");
      } else {
        await api.post("/medicines", payload);
        toast.success("Medicine added");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (medicine) => {
    setEditingId(medicine._id);
    setForm({
      name: medicine.name,
      brand: medicine.brand || "",
      category: medicine.category,
      description: medicine.description || "",
      price: medicine.price,
      mrp: medicine.mrp || "",
      stock: medicine.stock,
      requiresPrescription: medicine.requiresPrescription,
    });
    setTab("add");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this medicine?")) return;
    try {
      await api.delete(`/medicines/${id}`);
      toast.success("Medicine deleted");
      fetchMedicines();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center py-16 text-ink/50 dark:text-slate-400">Loading admin panel...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-ink dark:text-slate-100 mb-6">Admin Dashboard</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["analytics", "medicines", "add", "orders"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === t ? "bg-brand-600 text-white" : "bg-white dark:bg-slate-800 text-ink/70 dark:text-slate-300"
            }`}
          >
            {t === "analytics" ? "Analytics" : t === "medicines" ? "Inventory" : t === "add" ? (editingId ? "Edit Medicine" : "Add Medicine") : "Orders"}
          </button>
        ))}
      </div>

      {tab === "analytics" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${analytics.totalRevenue.toLocaleString("en-IN")}`} tint="bg-brand-100 text-brand-700" />
            <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} tint="bg-accent-100 text-accent-600" />
            <StatCard icon={Package} label="Medicines Listed" value={medicines.length} tint="bg-sky-100 text-sky-600" />
            <StatCard icon={Clock} label="Pending Orders" value={analytics.pendingCount} tint="bg-amber-100 text-amber-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
              <h3 className="font-display font-semibold text-ink dark:text-slate-100 mb-4 text-sm">Top Selling Medicines</h3>
              {analytics.topSellers.length === 0 ? (
                <p className="text-sm text-ink/40 dark:text-slate-500 py-10 text-center">No sales data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={analytics.topSellers} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartGrid} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: chartTick }} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: chartTick }} />
                    <Tooltip contentStyle={darkMode ? { background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" } : undefined} />
                    <Bar dataKey="qty" name="Units sold" fill="#1F786C" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
              <h3 className="font-display font-semibold text-ink dark:text-slate-100 mb-4 text-sm">Revenue — Last 7 Days</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={analytics.revenueTrend}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC9522" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EC9522" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartTick }} />
                  <YAxis tick={{ fontSize: 11, fill: chartTick }} />
                  <Tooltip formatter={(v) => [`₹${v}`, "Revenue"]} contentStyle={darkMode ? { background: "#1e293b", border: "1px solid #334155", color: "#e2e8f0" } : undefined} />
                  <Area type="monotone" dataKey="revenue" stroke="#EC9522" fill="url(#revGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "medicines" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 dark:text-slate-400 border-b dark:border-slate-700">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m._id} className="border-b dark:border-slate-700 last:border-0 text-ink dark:text-slate-200">
                  <td className="p-3 font-medium text-ink dark:text-slate-100">{m.name}</td>
                  <td className="p-3">{m.category}</td>
                  <td className="p-3">₹{m.price}</td>
                  <td className="p-3">{m.numReviews > 0 ? `★ ${m.avgRating.toFixed(1)} (${m.numReviews})` : "—"}</td>
                  <td className="p-3">{m.stock}</td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => handleEdit(m)} className="text-brand-600 dark:text-brand-400 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(m._id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "add" && (
        <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 max-w-lg space-y-4">
          <input
            required
            placeholder="Medicine name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {["Painkiller", "Antibiotic", "Antiseptic", "Vitamin", "Diabetes", "Cardiac", "Skincare", "Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex gap-3">
            <input
              required
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              required
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <input
            type="number"
            placeholder="MRP (₹) — optional, shows a discount badge"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            className="w-full px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <label className="flex items-center gap-2 text-sm text-ink/70 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.requiresPrescription}
              onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })}
            />
            Requires prescription
          </label>
          <button type="submit" className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700">
            {editingId ? "Update Medicine" : "Add Medicine"}
          </button>
        </form>
      )}

      {tab === "orders" && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <span className="text-sm text-ink/50 dark:text-slate-400">
                  #{order._id.slice(-6).toUpperCase()} · {order.user?.name} ({order.user?.email})
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="text-sm border dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-900 text-ink dark:text-slate-100"
                >
                  {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-ink/70 dark:text-slate-400">{order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-semibold text-ink dark:text-slate-100">Total: ₹{order.totalAmount}</p>
                {order.requiresPrescription && order.prescriptionImage && (
                  <button
                    onClick={() => setPrescriptionPreview(order.prescriptionImage)}
                    className="flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full hover:bg-amber-200 transition"
                  >
                    <FileImage size={12} /> View Prescription
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescription preview modal */}
      {prescriptionPreview && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setPrescriptionPreview(null)}
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-ink dark:text-slate-100">Uploaded Prescription</h3>
              <button onClick={() => setPrescriptionPreview(null)} className="text-ink/40 dark:text-slate-500 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <img src={prescriptionPreview} alt="Prescription" className="w-full rounded-lg border dark:border-slate-700" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
