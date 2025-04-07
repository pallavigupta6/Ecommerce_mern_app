import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <div className="bg-white py-20 px-6 text-center shadow-md ">
        {/* Cart Image */}
      

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to ShopNow
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Discover quality products at unbeatable prices.
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>

      {/* Featured Products Section (Static preview for now) */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src="https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI"
                alt={`Product ${item}`}
                className="w-full h-48 object-cover rounded-md"
              />

              <h3 className="mt-4 font-semibold text-lg">Product {item}</h3>
              <p className="text-sm text-gray-600">
                High quality and best in class.
              </p>
              <div className="mt-2 font-bold text-blue-600">$99.99</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
