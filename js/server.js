const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// ======================
// CONFIG
// ======================

const FIREBASE_URL =
  "https://contador-reto-default-rtdb.firebaseio.com/counters.json";

const SECRET_TOKEN = "abc123"; // cámbialo

// ======================
// ESTADO LOCAL
// ======================

let stats = {
  subs: 0,
  bits: 0
};

// Anti spam simple (último evento)
let lastEvent = {
  type: null,
  time: 0
};

// ======================
// UTIL: GUARDAR FIREBASE
// ======================

async function saveToFirebase() {
  try {
    await fetch(FIREBASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(stats)
    });
  } catch (err) {
    console.log("Error Firebase:", err.message);
  }
}

// ======================
// MIDDLEWARE SIMPLE
// ======================

app.get("/event", async (req, res) => {
  try {
    const { type, amount, token } = req.query;

    // seguridad
    if (token !== SECRET_TOKEN) {
      return res.status(403).send("Invalid token");
    }

    const now = Date.now();

    // anti spam (500ms)
    if (lastEvent.type === type && now - lastEvent.time < 500) {
      return res.send("ignored spam");
    }

    lastEvent = { type, time: now };

    // ======================
    // SUBS
    // ======================
    if (type === "sub") {
      stats.subs += 1;
    }

    // ======================
    // BITS
    // ======================
    if (type === "cheer") {
      const value = Number(amount || 0);
      stats.bits += value;
    }

    // guardar en firebase
    await saveToFirebase();

    console.log("Evento:", type, amount);

    res.send("ok");
  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
});

// ======================
// RESET (opcional)
// ======================

app.get("/reset", async (req, res) => {
  stats = { subs: 0, bits: 0 };
  await saveToFirebase();
  res.send("reset ok");
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
