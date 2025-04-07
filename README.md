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
- **Backend**: Node.js, Express 
- **Database**: MongoDB 
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


npm install
npm run dev


The Admin product creation functionality is not integrated with the frontend UI yet.
To add a product manually, please use Postman (or any API testing tool) and send a POST request to:

POST http://localhost:3000/api/admin/create
Make sure to:

Include the required product data in the request body (in JSON format).
{
    "name": "Bob",
    "address": "Bangalore",
    "mobileNumber": "9898989898",
    "dateOfBirth": "1998-09-06",
    "email": "bob@gmail.com",
    "password": "Password@1998"
}
Set the proper authorization header (if your backend requires auth).

<img width="1512" alt="Screenshot 2025-04-07 at 12 35 32 PM" src="https://github.com/user-attachments/assets/6abc1418-ecee-414c-8187-29ba08feb6d8" />





