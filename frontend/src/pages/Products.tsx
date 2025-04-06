import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { Product } from "../types";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import axiosClient from "../api/axiosClient";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// const categories = ["All", "Electronics", "Clothing", "table", "Watch"];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<
    Array<Omit<Product, "images"> & { image: string }>
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosClient.get("/products");
        if (response.data.success) {
          const formatted = response.data.products.map(
            (p: {
              _id: string;
              name: string;
              description: string;
              price: number;
              stock: number;
              category: string;
              images?: { url: string }[];
            }) => ({
              id: p._id,
              name: p.name,
              description: p.description,
              price: p.price,
              stock: p.stock,
              category: p.category,
              image:
                p.images?.[0]?.url ||
                "https://via.placeholder.com/500x500?text=No+Image",
            })
          );
          setProducts(formatted);
          // Extract unique categories
      const categorySet: Set<string> = new Set(response.data.products.map((p: { category: string }) => p.category));
      const categories = ["All", ...Array.from(categorySet)];
      setCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch =
      product.price >= selectedPriceRange.min &&
      product.price <= selectedPriceRange.max;
    return categoryMatch && priceMatch;
  });

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = async (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      try {
        // Call backend API to add item to cart
        await axiosClient.post("/cart/add", {
          productId: product.id,
          quantity: quantity,
        });

        // Update local state/cart
        addItem(product, quantity);

        // Reset quantity input
        setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token"); // or sessionStorage
        await axiosClient.delete(`/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts((prev) =>
          prev.filter((product) => product.id !== productId)
        );
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Failed to delete product:", error.response.data);
          alert(error.response.data.message || "Failed to delete product.");
        } else {
          console.error("Failed to delete product:", error);
          alert("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Filter Controls */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <select
            value={selectedPriceRange.label}
            onChange={(e) => {
              const range = priceRanges.find((r) => r.label === e.target.value);
              if (range) setSelectedPriceRange(range);
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {priceRanges.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <div
              className="aspect-w-3 aspect-h-2 cursor-pointer"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {product.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600">
                  Stock: {product.stock}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                    disabled={!quantities[product.id]}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">
                    {quantities[product.id] || 0}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                    disabled={quantities[product.id] >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(product as unknown as Product)}
                  disabled={!quantities[product.id]}
                  className="flex items-center space-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
                {user?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
