import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Order from "./pages/Orders";
import Dashboard from "./pages/admin/dashboard";
import ProductForm from "./pages/admin/ProductForm";
import AdminOrderList from "./pages/admin/AdminOrderList";
import CouponList from "./pages/admin/CreateCouponForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { login } = useAuthStore();

  // fetch user data from local storage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      return;
    }
    const parsedUser = JSON.parse(user);
    login(parsedUser);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Customer Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />

              <Route path="/orders" element={<Order />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductForm />} />
              <Route path="/admin/orders" element={<AdminOrderList />} />
              <Route path="/admin/coupons" element={<CouponList />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
