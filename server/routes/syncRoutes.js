import express from "express";
import { firestore } from "../firebaseAdmin.js";
import admin from "firebase-admin";


const router = express.Router();

// Helper: map DummyJSON product → our format
const mapDummyProduct = (p) => ({
  name: p.title,
  price: Math.round(p.price * 83), // USD → INR approx
  image: p.thumbnail,
  category: p.category || "Others",
  description: p.description || "",
  rating: p.rating || 0,
  stock: p.stock || 0,
  source: "dummyjson",
});

// Helper: map FakeStore product → our format
const mapFakeStoreProduct = (p) => ({
  name: p.title,
  price: Math.round(p.price * 83),
  image: p.image,
  category: p.category || "Others",
  description: p.description || "",
  rating: p.rating || 0,
  stock: 10, // FakeStore doesn’t give stock, set default
  source: "fakestore",
});

// POST /api/admin/sync-products
router.post("/sync-products", async (req, res) => {
  try {
    // 1) Fetch DummyJSON products
    const dummyRes = await fetch("https://dummyjson.com/products?limit=80");
    const dummyData = await dummyRes.json();
    const dummyProducts = dummyData.products || [];

    // 2) Fetch FakeStore products
    const fakeRes = await fetch("https://fakestoreapi.com/products");
    const fakeProducts = await fakeRes.json();

    const batch = firestore.batch();
    const productsCollection = firestore.collection("products");

    // 3) Prepare DummyJSON writes
    dummyProducts.forEach((p) => {
      const id = `dummy_${p.id}`;
      const ref = productsCollection.doc(id);
      batch.set(
        ref,
        {
          ...mapDummyProduct(p),
          externalId: p.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });

    // 4) Prepare FakeStore writes
    fakeProducts.forEach((p) => {
      const id = `fake_${p.id}`;
      const ref = productsCollection.doc(id);
      batch.set(
        ref,
        {
          ...mapFakeStoreProduct(p),
          externalId: p.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });

    // 5) Commit batch
    await batch.commit();

    res.json({
      success: true,
      message: `Synced ${dummyProducts.length} DummyJSON + ${fakeProducts.length} FakeStore products to Firestore`,
    });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ success: false, message: "Sync failed", error: err.message });
  }
});

export default router;
