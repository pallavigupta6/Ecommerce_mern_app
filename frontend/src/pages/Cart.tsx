import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { Plus, Minus, Trash2, Tag } from "lucide-react";
import axiosClient from "../api/axiosClient";
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, appliedCoupon, setCoupon, setCartItems } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const [availableCoupons, setAvailableCoupons] = useState<
    {
      code: string;
      discountPercentage: number;
      minCartValue: number;
      validFrom: string;
      validUntil: string;
      isActive: boolean;
    }[]
  >([]);

  const fetchCartItems = async () => {
    try {
      const response = await axiosClient.get("/cart");
      console.log("Fetched cart items:", response.data);
      const cartItems = response.data?.cart?.items ?? [];
      setCartItems(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosClient.get("/coupons");
        setAvailableCoupons(response.data?.coupons);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      }
    };

    fetchCartItems();
    fetchCoupons();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to view your cart
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;

  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = (subtotal * appliedCoupon.discount) / 100;
  }

  const total = subtotal + gstAmount - discountAmount;

  const handleQuantityChange = async (productId: string, delta: number) => {
    const item = items.find((item) => item.product._id === productId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + delta);
      console.log("New quantity:", newQuantity, productId);
      try {
        const response = await axiosClient.put("/cart/update", {
          productId,
          quantity: newQuantity,
        });

        console.log("Fetched cart items:", response.data);
        const cartItems = response.data?.cart?.items ?? [];
        setCartItems(cartItems);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const coupon = availableCoupons.find((c) => c.code === couponCode);

    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }

    const currentDate = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) {
      setCouponError("This coupon is not active");
      return;
    }

    if (currentDate < validFrom || currentDate > validUntil) {
      setCouponError("This coupon is expired or not yet valid");
      return;
    }

    if (subtotal < coupon.minCartValue) {
      setCouponError(`Minimum cart value of ₹${coupon.minCartValue} required`);
      return;
    }

    try {
      // Send API request
      await axiosClient.post("/cart/apply-coupon", {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        isActive: coupon.isActive,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        minCartValue: coupon.minCartValue,
      });

      // Update local store
      setCoupon({
        code: coupon.code,
        discount: coupon.discountPercentage,
        minValue: coupon.minCartValue,
      });

      setCouponCode("");
      setCouponError("");
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      setCouponError("Something went wrong while applying the coupon");
    }
  };

  const handleCheckout = async () => {
    try {
      // Send API request
      await axiosClient.post("/orders");
      setCartItems([]);
      navigate("/orders");
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      setCouponError("Something went wrong while applying the coupon");
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.product._id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.product.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.product._id, -1)
                            }
                            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.product._id, 1)
                            }
                            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                -item.quantity
                              )
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span className="text-gray-900">${gstAmount.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.discount}% off)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {!appliedCoupon && (
                  <>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter coupon code"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="inline-flex items-center space-x-1 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        <Tag className="h-4 w-4" />
                        <span>Apply</span>
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={handleCheckout}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
