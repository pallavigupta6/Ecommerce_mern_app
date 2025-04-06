import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

const Dashboard = () => {
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: { _id: string; count: number }[];
    lowStockProducts: { id: string; name: string; stock: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient("/orders/dashboard/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-xl font-semibold">{stats.totalOrders}</h3>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">Total Sales</p>
            <h3 className="text-xl font-semibold">₹{stats.totalRevenue.toFixed(2)}</h3>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">Low Stock Products</p>
            <h3 className="text-xl font-semibold">{stats.lowStockProducts.length}</h3>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm mb-2">Orders by Status</p>
            {stats.ordersByStatus.length > 0 ? (
              <ul className="space-y-1 text-sm text-gray-700">
                {stats.ordersByStatus.map((status) => (
                  <li key={status._id}>
                    <span className="font-medium">{status._id}</span>: {status.count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No status data</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-500">Failed to load stats.</p>
      )}
    </div>
  );
};

export default Dashboard;
