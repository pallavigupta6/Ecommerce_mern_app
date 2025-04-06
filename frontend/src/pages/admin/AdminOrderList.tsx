import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

interface OrderItem {
  product: {
    name: string;
  } | null;
  quantity: number;
  price: number;
}

interface Coupon {
  code: string;
  discountPercentage: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  status: string;
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  coupon?: Coupon;
  createdAt: string;
}

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders");
        setOrders(res.data.orders); // 👈 updated to use "orders" from response
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setMessage("Order status updated.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
      setMessage("Failed to update order status.");
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      {message && <p className="mb-4 text-green-600 font-medium">{message}</p>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4 bg-white shadow">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold">Order ID: {order._id}</p>
                  <p>User ID: {order.user}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="ml-2 border px-2 py-1 rounded"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">Items:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name || "Unknown Product"} ×{" "}
                      {item.quantity} — ₹{item.price}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-1 text-sm text-gray-800">
                  <p>Subtotal: ₹{order.subtotal.toFixed(2)}</p>
                  <p>GST: ₹{order.gst.toFixed(2)}</p>
                  <p>Discount: ₹{order.discount.toFixed(2)}</p>
                  <p className="font-medium">
                    Total: ₹{order.total.toFixed(2)}
                  </p>
                </div>

                {order.coupon && (
                  <div className="mt-2 text-sm text-blue-600">
                    <p>
                      Coupon Applied: <strong>{order.coupon.code}</strong> (
                      {order.coupon.discountPercentage}% Off)
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrderList;
