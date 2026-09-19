import { useEffect, useState } from "react";
import { MapPin, FileImage } from "lucide-react";
import api from "../api/axios";
import OrderStepper from "../components/OrderStepper";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center py-16 text-ink/50 dark:text-slate-400">Loading your orders...</p>;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-ink dark:text-slate-100 mb-2">No orders yet</h2>
        <p className="text-ink/60 dark:text-slate-400">Your placed orders will show up here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-ink dark:text-slate-100 mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-ink/50 dark:text-slate-400">
                Order #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}
              </span>
              {order.requiresPrescription && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  <FileImage size={11} /> Rx Verified
                </span>
              )}
            </div>

            <div className="mb-4">
              <OrderStepper status={order.status} />
            </div>

            <div className="divide-y dark:divide-slate-700 border-t dark:border-slate-700 pt-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1.5 text-sm">
                  <span className="text-ink/80 dark:text-slate-300">{item.name} × {item.quantity}</span>
                  <span className="text-ink/60 dark:text-slate-400">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {order.shippingAddress && (
              <div className="flex items-start gap-2 mt-3 pt-3 border-t dark:border-slate-700 text-sm text-ink/60 dark:text-slate-400">
                <MapPin size={15} className="text-brand-600 shrink-0 mt-0.5" />
                <span>
                  Delivered to: {order.shippingAddress}
                  {order.phone && <span className="text-ink/40 dark:text-slate-500"> · {order.phone}</span>}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t dark:border-slate-700">
              <span className="text-sm text-ink/50 dark:text-slate-400">
                {order.paymentMethod} · {order.paymentStatus}
              </span>
              <span className="font-bold text-ink dark:text-slate-100">₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
