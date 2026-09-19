import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldAlert, UploadCloud, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState("");
  const [prescriptionName, setPrescriptionName] = useState("");

  const needsPrescription = cartItems.some((i) => i.requiresPrescription);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      return toast.error("File too large — please upload an image under 4MB");
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPrescriptionImage(reader.result);
      setPrescriptionName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      return navigate("/login");
    }
    if (!address || !phone) {
      return toast.error("Please enter shipping address and phone");
    }

    setPlacing(true);
    try {
      const items = cartItems.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity }));
      const { data: order } = await api.post("/orders", {
        items,
        shippingAddress: address,
        phone,
        paymentMethod,
        prescriptionImage: prescriptionImage || undefined,
      });
      toast.success("Order placed successfully!");
      clearCart();
      navigate(`/order-confirmation/${order._id}`, { state: { order } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-ink dark:text-slate-100 mb-2">Your cart is empty</h2>
        <p className="text-ink/60 dark:text-slate-400 mb-6">Browse medicines and add items to your cart.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-brand-600 text-white px-5 py-2 rounded-lg hover:bg-brand-700"
        >
          Browse Medicines
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-ink dark:text-slate-100 mb-6">Your Cart</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm divide-y dark:divide-slate-700">
        {cartItems.map((item) => (
          <div key={item.medicineId} className="flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink dark:text-slate-100">{item.name}</p>
                {item.requiresPrescription && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                    <ShieldAlert size={11} /> Rx
                  </span>
                )}
              </div>
              <p className="text-sm text-ink/50 dark:text-slate-400">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold"
              >
                −
              </button>
              <span className="w-6 text-center dark:text-slate-100">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.medicineId)}
                className="text-red-500 text-sm ml-3 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription upload — optional, shown as a helpful nudge when the cart has Rx medicines */}
      {needsPrescription && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-5 mt-6">
          <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">
            <ShieldAlert size={18} /> Prescription Medicines in Cart
          </div>
          <p className="text-sm text-amber-800/80 mb-4">
            Your cart contains prescription medicines. Uploading a prescription is optional here, but our
            pharmacist may contact you to verify one before delivery.
          </p>

          {prescriptionImage ? (
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 dark:border-slate-700 rounded-lg p-3 border">
              <img src={prescriptionImage} alt="Prescription preview" className="w-14 h-14 object-cover rounded-md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink dark:text-slate-100 truncate">{prescriptionName}</p>
                <p className="text-xs text-green-600">Uploaded</p>
              </div>
              <button
                onClick={() => { setPrescriptionImage(""); setPrescriptionName(""); }}
                className="text-ink/40 dark:text-slate-500 hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-300 rounded-lg py-6 cursor-pointer hover:bg-amber-100/50 transition">
              <UploadCloud className="text-amber-600" size={24} />
              <span className="text-sm text-amber-800 font-medium">Click to upload prescription (optional)</span>
              <span className="text-xs text-amber-700/60">JPG or PNG, up to 4MB</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 mt-6">
        <h3 className="font-semibold text-ink dark:text-slate-100 mb-4">Shipping Details</h3>

        <label className="text-sm font-medium text-ink/80 dark:text-slate-300">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full mt-1 mb-4 px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Full delivery address"
        />

        <label className="text-sm font-medium text-ink/80 dark:text-slate-300">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mt-1 mb-4 px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Contact number"
        />

        <label className="text-sm font-medium text-ink/80 dark:text-slate-300">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full mt-1 mb-4 px-3 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-ink dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        <div className="flex items-center justify-between text-lg font-bold text-ink dark:text-slate-100 mb-4">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-60"
        >
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
