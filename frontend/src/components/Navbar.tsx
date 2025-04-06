import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            E-Commerce
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-600 hover:text-gray-800">
              Products
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="text-gray-600 hover:text-gray-800 relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                    <User className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 w-48 py-2 -top-2 pt-8 rounded-md shadow-xl hidden group-hover:block">
                    <div className="mt-2 bg-white">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to={
                          user?.role === "admin" ? "/admin/orders" : "/orders"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      {user?.role === "admin" && (
                        <>
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/products"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                          >
                            Add Product
                          </Link>
                          <Link
                            to="/admin/coupons"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                          >
                            Coupons
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => logout()}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-800">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
