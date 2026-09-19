import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { CheckCircle2, MapPin, Phone, CreditCard, PackageCheck } from "lucide-react";
import api from "../api/axios";
import OrderStepper from "../components/OrderStepper";

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (order) return;
    const fetchOrder = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        const found = data.find((o) => o._id === id);
        setOrder(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p className="text-center py-16 text-ink/50 dark:text-slate-400">Loading order details...</p>;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-ink dark:text-slate-100 mb-2">Order not found</h2>
        <Link to="/orders" className="text-brand-600 font-medium hover:underline">
          Go to My Orders
        </Link>
      </div>
    );
  }

  const placedOn = new Date(order.createdAt);
  const estDeliveryStart = new Date(placedOn);
  estDeliveryStart.setDate(estDeliveryStart.getDate() + 2);
  const estDeliveryEnd = new Date(placedOn);
  estDeliveryEnd.setDate(estDeliveryEnd.getDate() + 4);

  const dateFmt = (d) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Success header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-brand-600 dark:text-brand-400" size={36} />
        </div>
        <h1 className="text-2xl font-bold text-ink dark:text-slate-100 mb-1">Order Placed Successfully!</h1>
        <p className="text-ink/60 dark:text-slate-400">
          Order <span className="font-semibold text-ink dark:text-slate-100">#{order._id.slice(-6).toUpperCase()}</span> ·{" "}
          {placedOn.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
        <p className="text-sm text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 inline-block px-3 py-1 rounded-full mt-3">
          Estimated delivery: {dateFmt(estDeliveryStart)} – {dateFmt(estDeliveryEnd)}
        </p>
      </div>

      {/* Status stepper */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-6">
        <OrderStepper status={order.status} />
      </div>

      {/* Delivering to */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="font-display font-semibold text-ink dark:text-slate-100 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-brand-600" /> Delivering To
        </h3>
        <p className="text-sm text-ink/80 dark:text-slate-300 leading-relaxed">{order.shippingAddress}</p>
        <p className="text-sm text-ink/60 dark:text-slate-400 flex items-center gap-2 mt-2">
          <Phone size={14} /> {order.phone}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-6">
        <h3 className="font-display font-semibold text-ink dark:text-slate-100 mb-4 flex items-center gap-2">
          <PackageCheck size={18} className="text-brand-600" /> Order Summary
        </h3>
        <div className="divide-y dark:divide-slate-700">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-2 text-sm">
              <span className="text-ink/80 dark:text-slate-300">{item.name} × {item.quantity}</span>
              <span className="text-ink/60 dark:text-slate-400">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t dark:border-slate-700">
          <span className="flex items-center gap-2 text-sm text-ink/50 dark:text-slate-400">
            <CreditCard size={14} /> {order.paymentMethod} · {order.paymentStatus}
          </span>
          <span className="font-bold text-ink dark:text-slate-100 text-lg">₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/orders"
          className="flex-1 text-center bg-brand-600 text-white py-2.5 rounded-lg font-medium hover:bg-brand-700 transition"
        >
          View My Orders
        </Link>
        <Link
          to="/"
          className="flex-1 text-center bg-white dark:bg-slate-800 border dark:border-slate-700 text-ink dark:text-slate-100 py-2.5 rounded-lg font-medium hover:bg-brand-50 dark:hover:bg-slate-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
