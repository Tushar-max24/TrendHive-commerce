🛍️ TrendHive — Full-Stack E-Commerce Web Application

TrendHive is a modern e-commerce web platform built with React, Firebase, Stripe, and TailwindCSS.
It includes features such as product browsing, cart, checkout, payments, order tracking, admin dashboard, automated emails, and PWA support.

🚀 Live Demo

🔗 Frontend: https://trend-hive-commerce.vercel.app

🔗 Backend (Render): https://trendhive-commerce-1.onrender.com

✨ Features
🛒 User Features

✔️ Login / Signup with Firebase Auth

✔️ Browse products by category

✔️ Search + Sorting + Filters

✔️ Add to Cart, Update Quantity

✔️ Checkout with:

💳 Stripe Payment Gateway

🏠 Cash on Delivery (COD)

✔️ Save Shipping Address

✔️ Order Status Tracking (Processing → Packed → Shipped → Delivered)

✔️ Download invoice (PDF)

✔️ Email notifications for order updates

✔️ PWA support → Install app like mobile app

✔️ Dark / Light theme toggle

🛠️ Admin Dashboard
Feature	Status
Product management (Add, Edit, Delete)	✔️
Sync products from external API	✔️
Orders management with live update	✔️
Order status update with email notification	✔️
Revenue insights + charts	✔️
Manage users (optional extension)	⚙️ In Progress
📦 Tech Stack
Frontend:

React JS

React Router

Tailwind CSS

Context API (Auth, Cart, Theme, Product State)

jsPDF (Invoice)

EmailJS

PWA (Service Worker + Manifest)

Backend:

Node.js + Express

Stripe Payment API

Firebase Admin SDK

Database & Auth:

Firebase Firestore

Firebase Authentication

🗂 Folder Structure
📦 project
 ┣ 📁 client (React Frontend)
 ┣ 📁 server (Node.js Backend)
 ┣ 📄 package.json

🔧 Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/Tushar-max24/TrendHive.git
cd TrendHive

2️⃣ Install Dependencies

Frontend:

cd client
npm install


Backend:

cd ../server
npm install

3️⃣ Setup Environment Variables
client/.env
REACT_APP_FIREBASE_API_KEY=xxxx
REACT_APP_STRIPE_PUBLIC_KEY=xxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxx

server/.env
STRIPE_SECRET_KEY=xxxx
FIREBASE_SERVICE_JSON_PATH=serviceAccountKey.json

4️⃣ Start Development

Frontend:

npm start


Backend:

npm run dev

📦 Deployment
Platform	Status
Render (Backend API)	✔️ Deployed
Vercel (Frontend)	✔️ Deployed


🙌 Author

👤 Tushar Sharma

📧 Email: tusharjangid98870@gmail.com
