require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const cron = require("node-cron");

cron.schedule("0 3 * * *", async () => {
  console.log("⏰ Auto Sync Triggered at 3:00 AM");
  await syncExternalProducts(); // function reuse
});


// =============================
// 🔥 FIREBASE ADMIN INITIALIZE
// =============================
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
console.log("🔥 Firebase Admin initialized!");


// =============================
// 💳 STRIPE INIT
// =============================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// =============================
// 📦 SYNC EXTERNAL PRODUCTS
// =============================
app.post("/api/admin/sync-products", async (req, res) => {
  try {
    console.log("🔥 Sync request received...");

    // 📌 FETCH from DummyJSON API
    const dummyRes = await fetch("https://dummyjson.com/products?limit=50");
    const dummyData = await dummyRes.json();
    const dummyProducts = dummyData.products || [];

    // 📌 FETCH from FakeStore API
    const fakeRes = await fetch("https://fakestoreapi.com/products");
    const fakeData = await fakeRes.json();

    let count = 0;

    // ------------- Insert DummyJSON Products -------------
    for (const product of dummyProducts) {
      const productRef = db.collection("products").doc(`dummy_${product.id}`);
      const docExists = await productRef.get();

      if (!docExists.exists) {
        await productRef.set({
          name: product.title,
          price: product.price * 82,
          image: product.thumbnail,
          category: product.category.replace("_", " ").toUpperCase(),
          description: product.description,
          rating: product.rating,
          stock: product.stock,
          source: "DummyJSON API",
          createdAt: new Date(),
        });
        count++;
      }
    }

    // ------------- Insert FakeStoreAPI Products -------------
    for (const product of fakeData) {
      const productRef = db.collection("products").doc(`fake_${product.id}`);
      const docExists = await productRef.get();

      if (!docExists.exists) {
        await productRef.set({
          name: product.title,
          price: Math.round(product.price * 82),
          image: product.image,
          category: product.category.toUpperCase(),
          description: product.description,
          rating: product.rating?.rate || 4,
          stock: product.rating?.count || 50,
          source: "FakeStore API",
          createdAt: new Date(),
        });
        count++;
      }
    }

    return res.json({
      success: true,
      message: `✅ Synced ${count} NEW products from 2 APIs`,
    });

  } catch (err) {
    console.error("❌ Sync Failed:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});



// =============================
// 🛒 STRIPE CHECKOUT
// =============================
app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Ecommerce Order" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cart",
    });

    res.json({ id: session.id });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// =============================
// 🚀 SERVER STATUS
// =============================
app.get("/", (req, res) => res.send("🔥 Server is running fine!"));

// =============================
// 🚀 START SERVER
// =============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT}`)
);
