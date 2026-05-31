const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 Firebase
const FIREBASE_URL =
  "https://contador-reto-default-rtdb.firebaseio.com/counters.json";

// 🔐 Seguridad simple
const SECRET_TOKEN = "abc123";

// ======================
// FUNCIÓN: LEER + ACTUALIZAR
// ======================

async function updateStats(addSubs, addBits) {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    const current = data || { subs: 0, bits: 0 };

    const updated = {
      subs: (current.subs || 0) + (addSubs || 0),
      bits: (current.bits || 0) + (addBits || 0)
    };

    await fetch(FIREBASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    });

  } catch (err) {
    console.log("Firebase error:", err.message);
  }
}

// ======================
// ROUTE PRINCIPAL
// ======================

app.get("/event", async (req, res) => {
  try {
    const { type, amount, token } = req.query;

    // seguridad
    if (token !== SECRET_TOKEN) {
      return res.status(403).send("invalid token");
    }

    const value = Number(amount || 0);

    // SUB
    if (type === "sub") {
      await updateStats(1, 0);
    }

    // BITS
    if (type === "cheer") {
      await updateStats(0, value);
    }

    console.log("event:", type, value);

    res.send("");

  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
});

// ======================
// ROOT CHECK
// ======================

app.get("/", (req, res) => {
  res.send("server ok");
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
