import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const CreateCouponForm = () => {
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [minCartValue, setMinCartValue] = useState<number>(0);
  const [validTill, setValidTill] = useState("");
  const [message, setMessage] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [isActive, setIsActive] = useState(true); // true = active, false = inactive

  const [isEditing, setIsEditing] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    minCartValue: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
  }

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await axiosClient.get("/coupons");
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Add or update coupon
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingCouponId) {
        await axiosClient.put(`/coupons/${editingCouponId}`, {
          code,
          discountPercentage,
          minCartValue,
          validFrom: validFrom,
          validUntil: validTill,
          isActive: isActive,
        });
        setMessage("Coupon updated successfully!");
      } else {
        await axiosClient.post("/coupons", {
          code,
          discountPercentage,
          minCartValue,
          validUntil: validTill,
          validFrom: validFrom,
          isActive: isActive,
        });
        setMessage("Coupon created successfully!");
      }

      // Reset
      setCode("");
      setDiscountPercentage(0);
      setMinCartValue(0);
      setValidTill("");
      setIsEditing(false);
      setEditingCouponId(null);
      fetchCoupons();
    } catch (err) {
      console.error(err);
      setMessage(
        isEditing ? "Failed to update coupon." : "Failed to create coupon."
      );
    }
  };

  // Delete coupon
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axiosClient.delete(`/coupons/${id}`);
      setMessage("Coupon deleted successfully!");
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon", err);
      setMessage("Failed to delete coupon.");
    }
  };

  // Edit coupon
  const handleEdit = (coupon: Coupon) => {
    setIsEditing(true);
    setEditingCouponId(coupon._id);
    setCode(coupon.code);
    setDiscountPercentage(coupon.discountPercentage);
    setMinCartValue(coupon.minCartValue);
    setValidTill(coupon.validUntil.split("T")[0]); // YYYY-MM-DD
  };

  return (
    <div className="p-6 bg-white rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Update Coupon" : "Create Coupon"}
      </h2>

      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Coupon Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Discount Percentage</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            required
            min={1}
            max={100}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Minimum Cart Value (₹)</label>
          <input
            type="number"
            value={minCartValue}
            onChange={(e) => setMinCartValue(Number(e.target.value))}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Valid From</label>
          <input
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Valid Till</label>
          <input
            type="date"
            value={validTill}
            onChange={(e) => setValidTill(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            value={isActive.toString()}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className={`${
              isEditing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold px-4 py-2 rounded`}
          >
            {isEditing ? "Update Coupon" : "Create Coupon"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingCouponId(null);
                setCode("");
                setDiscountPercentage(0);
                setMinCartValue(0);
                setValidFrom("");
                setValidTill("");
                setIsActive(true);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Coupon List Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Available Coupons</h3>
        {coupons.length === 0 ? (
          <p className="text-gray-500">No coupons available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Code</th>
                  <th className="p-2 border">Discount (%)</th>
                  <th className="p-2 border">Min Cart Value</th>
                  <th className="p-2 border">Valid From</th>
                  <th className="p-2 border">Valid Until</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="text-center">
                    <td className="p-2 border">{coupon.code}</td>
                    <td className="p-2 border">{coupon.discountPercentage}%</td>
                    <td className="p-2 border">₹{coupon.minCartValue}</td>
                    <td className="p-2 border">
                      {new Date(coupon.validFrom).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      {new Date(coupon.validUntil).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">
                      {coupon.isActive ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCouponForm;
