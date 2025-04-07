# Ecommerce_mern_app
# 🛍️ ShopNow - E-commerce Platform

ShopNow is a full-featured e-commerce platform built with **React + TypeScript + Vite**, featuring both customer and admin interfaces.

## 🚀 Features

### 👤 Customer Features
- Browse all products
- View detailed product pages
- Add items to cart
- Register and log in
- Place orders
- View order history
- Manage profile

### 🛠️ Admin Features
- Admin dashboard overview
- Create/edit/delete products
- View/manage all orders
- Create and manage discount coupons

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes for customers and admins

---

## 🧩 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Router
- **State Management**: Zustand
- **Backend**: Node.js, Express (assumed for API)
- **Database**: MongoDB (assumed)
- **Auth**: JWT
- **Other**: Axios for API calls

---

## 📁 Project Structure

├── public/
 ├── src/
  │ ├── components/
    Reusable components (Navbar, ProtectedRoute, etc.) │ ├── pages/ # All page components (Home, Products, Login, Admin) │ │ 
    ├── admin/ # Admin pages │ ├── store/ # Zustand store for global state (auth) │ ├── App.tsx # Main app routing │ ├── main.tsx # Entry point

---

## 🧪 How to Run the Project

### 1. Clone the repo
```bash
git clone https://github.com/pallavigupta6/Ecommerce_mern_app
cd filename


