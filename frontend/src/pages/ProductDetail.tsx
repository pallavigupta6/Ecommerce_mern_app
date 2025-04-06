import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Product } from "../types";
import axiosClient from "../api/axiosClient";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  // const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/products/${id}`);
        const productData = res.data?.product;
        setProduct(
          productData
            ? { ...productData, image: productData.images?.[0]?.url }
            : undefined
        );
      } catch (err) {
        console.error("Failed to fetch product:", err);
        alert("Product not found or error occurred");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    setQuantities((current) => {
      const newQuantity = Math.max(0, current + delta);
      return newQuantity;
    });
  };

  const handleAddToCart = async (product: Product) => {
    console.log("Adding to cart:", product, quantities);
    if (quantities > 0) {
      try {
        // Call backend API to add item to cart
        await axiosClient.post("/cart/add", {
          productId: product._id,
          quantity: quantities,
        });
        addItem(product, quantities);
        setQuantities(0);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  if (loading) return <p className="text-center py-20">Loading product...</p>;
  if (!product) return <p className="text-center py-20">Product not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/products")}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.image || ""}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-xl font-semibold text-gray-900">
              $
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : "0.00"}
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Availability:</span>
              <span
                className={`font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  disabled={!quantities}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">
                  {quantities || 0}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                  disabled={quantities >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={!quantities}
                className="flex items-center space-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
