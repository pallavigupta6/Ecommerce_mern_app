import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Order Placed":
      return <ShoppingBag className="w-5 h-5 text-blue-500" />;
    case "Packed":
      return <Package className="w-5 h-5 text-yellow-500" />;
    case "Shipping":
      return <Truck className="w-5 h-5 text-purple-500" />;
    case "Delivered":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "Cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <ShoppingBag className="w-5 h-5 text-gray-500" />;
  }
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  discount: number;
  gst: number;
  subTotal: number;
  items: OrderItem[];
}

type ApiOrderItem = {
  product: {
    name: string;
  } | null;
  quantity: number;
  price: number;
};

type ApiOrder = {
  _id: string;
  createdAt: string;
  total: number;
  status: string;
  discount: number;
  subTotal: number;
  gst: number;
  items: ApiOrderItem[];
};

const OrderCard = ({ order }: { order: Order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusIcon status={order.status} />
          <div>
            <h3 className="font-semibold">Order #{order.id}</h3>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold">${order.total.toFixed(2)}</p>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "Shipping"
                  ? "bg-purple-100 text-purple-800"
                  : order.status === "Packed"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {order.status}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-medium mb-2">Order Items</h4>
          <div className="space-y-2">
            {order.items.map((item: OrderItem, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500"> × {item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-sm">Discount</span>
              <span className="text-sm text-green-800 font-semibold">
                -${order.discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">GST (18%)</span>
              <span className="text-sm font-semibold">
                ${order.gst.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Amount</span>
              <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Order() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosClient.get("/orders");

        const apiOrders: ApiOrder[] = response.data.orders;
        const formattedOrders: Order[] = apiOrders.map((order) => ({
          id: order._id,
          date: new Date(order.createdAt).toLocaleDateString(),
          total: order.total,
          status: order.status,
          discount: order.discount,
          gst: order.gst,
          subTotal: order.subTotal,
          items: order.items.map((item) => ({
            name: item.product?.name || "Unknown Product",
            quantity: item.quantity,
            price: item.price,
          })),
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Order;
