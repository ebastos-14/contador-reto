import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// =====================
// FIREBASE CONFIG
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyCn_diQLgCbhiL9vu5aFtABR7n0ORvd7Ps",
  authDomain: "contador-reto.firebaseapp.com",
  databaseURL: "https://contador-reto-default-rtdb.firebaseio.com",
  projectId: "contador-reto",
  storageBucket: "contador-reto.firebasestorage.app",
  messagingSenderId: "704169660240",
  appId: "1:704169660240:web:1a4b3e35a9498292c0e655"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =====================
// REFERENCIA PRINCIPAL
// =====================
const styleRef = ref(db, "style");

// =====================
// ELEMENTOS UI
// =====================
const subsPicker = document.getElementById("subsPicker");
const subsHex = document.getElementById("subsHex");

const bitsPicker = document.getElementById("bitsPicker");
const bitsHex = document.getElementById("bitsHex");

const fontFamily = document.getElementById("fontFamily");
const fontSize = document.getElementById("fontSize");

// =====================
// DEFAULT STYLE
// =====================
const DEFAULT_STYLE = {
  subsColor: "#9146FF",
  bitsColor: "#FFD54F",
  textColor: "#ffffff",
  bgColor: "#1a1a1a",
  font: "Arial",
  size: 18
};

// =====================
// INIT FIREBASE (CREA SI NO EXISTE)
// =====================
async function init() {
  const snap = await get(styleRef);

  if (!snap.exists()) {
    await set(styleRef, {
      default: DEFAULT_STYLE,
      custom: null
    });

    console.log("Firebase style inicializado");
  }
}

init();

// =====================
// LISTENER REAL TIME
// =====================
onValue(styleRef, (snap) => {
  const data = snap.val();

  if (!data) return;

  const active = data.custom || data.default || DEFAULT_STYLE;

  loadInputs(active);
  applyCSS(active);
});

// =====================
// LOAD INPUTS
// =====================
function loadInputs(style) {
  subsPicker.value = style.subsColor;
  subsHex.value = style.subsColor;

  bitsPicker.value = style.bitsColor;
  bitsHex.value = style.bitsColor;

  fontFamily.value = style.font;
  fontSize.value = style.size;
}

// =====================
// APPLY CSS VARIABLES
// =====================
function applyCSS(style) {
  const root = document.documentElement;

  root.style.setProperty("--subs-color", style.subsColor);
  root.style.setProperty("--bits-color", style.bitsColor);
  root.style.setProperty("--text-color", style.textColor);
  root.style.setProperty("--bg-color", style.bgColor);
  root.style.setProperty("--font-family", style.font);
  root.style.setProperty("--font-size", style.size + "px");

  // preview visual (editor)
  const subsBox = document.getElementById("subsCurrent");
  const bitsBox = document.getElementById("bitsCurrent");

  if (subsBox) subsBox.style.background = style.subsColor;
  if (bitsBox) bitsBox.style.background = style.bitsColor;
}

// =====================
// GET CURRENT INPUT STATE
// =====================
function getCurrent() {
  return {
    subsColor: subsHex.value,
    bitsColor: bitsHex.value,
    textColor: "#ffffff",
    bgColor: "#1a1a1a",
    font: fontFamily.value,
    size: Number(fontSize.value)
  };
}

// =====================
// LIVE UPDATE
// =====================
function liveUpdate() {
  applyCSS(getCurrent());
}

// =====================
// INPUT EVENTS
// =====================
subsPicker.addEventListener("input", () => {
  subsHex.value = subsPicker.value;
  liveUpdate();
});

subsHex.addEventListener("input", () => {
  subsPicker.value = subsHex.value;
  liveUpdate();
});

bitsPicker.addEventListener("input", () => {
  bitsHex.value = bitsPicker.value;
  liveUpdate();
});

bitsHex.addEventListener("input", () => {
  bitsPicker.value = bitsHex.value;
  liveUpdate();
});

fontFamily.addEventListener("input", liveUpdate);
fontSize.addEventListener("input", liveUpdate);

// =====================
// GUARDAR EN FIREBASE
// =====================
document.getElementById("save").addEventListener("click", async () => {
  const custom = getCurrent();

  await set(ref(db, "style/custom"), custom);

  console.log("Custom guardado en Firebase");
});

// =====================
// RESET
// =====================
document.getElementById("reset").addEventListener("click", async () => {
  await set(ref(db, "style/custom"), null);

  console.log("Reset a default");
});
