const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// FIREBASE
// ======================
const FIREBASE_URL =
  "https://contador-reto-default-rtdb.firebaseio.com/counters.json";

// ======================
// TOKEN
// ======================
const SECRET_TOKEN = "abc123";

// ======================
// FECHA UTC
// ======================
function getUTCDate() {
  return new Date().toISOString().split("T")[0];
}

// ======================
// LEER + ACTUALIZAR
// ======================
async function updateStats(
  addSubs = 0,
  addBits = 0,
  addAvas = 0,
  addCofres = 0
) {
  try {
    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    const today = getUTCDate();

    let currentSubs = data?.current?.subs || 0;
    let currentBits = data?.current?.bits || 0;
    let currentAvas = data?.current?.avas || 0;
    let currentCofres = data?.current?.cofres || 0;

    const totalSubs = data?.total?.subs || 0;
    const totalBits = data?.total?.bits || 0;
    const totalAvas = data?.total?.avas || 0;
    const totalCofres = data?.total?.cofres || 0;

    let lastReset =
      data?.current?.lastReset || today;

    // ======================
    // RESET UTC AUTOMÁTICO
    // ======================
    if (lastReset !== today) {

      currentSubs = 0;
      currentBits = 0;
      currentAvas = 0;
      currentCofres = 0;

      lastReset = today;

      console.log("UTC reset ejecutado");
    }

    const updated = {
      current: {
        subs: currentSubs + addSubs,
        bits: currentBits + addBits,
        avas: currentAvas + addAvas,
        cofres: currentCofres + addCofres,
        lastReset
      },

      total: {
        subs: totalSubs + addSubs,
        bits: totalBits + addBits,
        avas: totalAvas + addAvas,
        cofres: totalCofres + addCofres
      }
    };

    await fetch(FIREBASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    });

    console.log("Updated:", updated);

  } catch (err) {
    console.log("Firebase update error:", err.message);
  }
}

// ======================
// CREAR ESTRUCTURA SI NO EXISTE
// ======================
async function initializeCounters() {
  try {

    const res = await fetch(FIREBASE_URL);
    const data = await res.json();

    if (data) {
      console.log("Counters ya existen");
      return;
    }

    const initialData = {
      current: {
        subs: 0,
        bits: 0,
        avas: 0,
        cofres: 0,
        lastReset: getUTCDate()
      },

      total: {
        subs: 0,
        bits: 0,
        avas: 0,
        cofres: 0
      }
    };

    await fetch(FIREBASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(initialData)
    });

    console.log("Counters inicializados");

  } catch (err) {
    console.log("Init error:", err.message);
  }
}

// ======================
// EVENTOS
// ======================
app.get("/event", async (req, res) => {
  try {

    const {
      type,
      amount,
      token
    } = req.query;

    if (token !== SECRET_TOKEN) {
      return res.status(403).send("invalid token");
    }

    const value = Number(amount || 0);

    // SUB
    if (type === "sub") {
      await updateStats(1, 0, 0, 0);
    }

    // BITS
    if (type === "bits" || type === "cheer") {
      await updateStats(0, value, 0, 0);
    }

    // AVA
    if (type === "ava") {
      await updateStats(0, 0, 1, 0);
    }

    // COFRE
    if (type === "cofre") {
      await updateStats(0, 0, 0, 1);
    }

    console.log(
      `[EVENT] type=${type} amount=${value}`
    );

    res.status(204).end();

  } catch (err) {

    console.log(err);

    res.status(500).send("error");
  }
});

// ======================
// TEST
// ======================
app.get("/", (req, res) => {
  res.send("server ok");
});

// ======================
// START
// ======================
app.listen(PORT, async () => {

  console.log(
    `Server running on port ${PORT}`
  );

  await initializeCounters();
});
