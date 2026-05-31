import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const styleRef = ref(db, "style");

// =====================
// ELEMENTOS
// =====================
const subsPicker = document.getElementById("subsPicker");
const subsHex = document.getElementById("subsHex");

const bitsPicker = document.getElementById("bitsPicker");
const bitsHex = document.getElementById("bitsHex");

const fontFamily = document.getElementById("fontFamily");
const fontSize = document.getElementById("fontSize");

// =====================
// STATE
// =====================
let state = {
    default: {
        subsColor: "#9146FF",
        bitsColor: "#FFD54F",
        textColor: "#ffffff",
        bgColor: "#1a1a1a",
        font: "Arial",
        size: 18
    },
    custom: null
};

// =====================
// LOAD FIREBASE
// =====================
onValue(styleRef, (snap) => {
    const data = snap.val();

    if (!data) {
        set(styleRef, state);
        return;
    }

    state = data;

    const active = state.custom || state.default;

    loadInputs(active);
    applyCSS(active);
});

// =====================
// INPUTS
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
    document.documentElement.style.setProperty("--subs-color", style.subsColor);
    document.documentElement.style.setProperty("--bits-color", style.bitsColor);
    document.documentElement.style.setProperty("--text-color", style.textColor || "#fff");
    document.documentElement.style.setProperty("--bg-color", style.bgColor || "#1a1a1a");
    document.documentElement.style.setProperty("--font-family", style.font);
    document.documentElement.style.setProperty("--font-size", style.size + "px");

    // preview box color
    document.getElementById("subsCurrent").style.background = style.subsColor;
    document.getElementById("bitsCurrent").style.background = style.bitsColor;
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
function live() {
    const style = getCurrent();
    applyCSS(style);
}

// =====================
// EVENTS
// =====================
subsPicker.addEventListener("input", () => {
    subsHex.value = subsPicker.value;
    live();
});

subsHex.addEventListener("input", () => {
    subsPicker.value = subsHex.value;
    live();
});

bitsPicker.addEventListener("input", () => {
    bitsHex.value = bitsPicker.value;
    live();
});

bitsHex.addEventListener("input", () => {
    bitsPicker.value = bitsHex.value;
    live();
});

fontFamily.addEventListener("input", live);
fontSize.addEventListener("input", live);

// =====================
// SAVE CUSTOM
// =====================
document.getElementById("save").addEventListener("click", () => {
    const custom = getCurrent();
    set(ref(db, "style/custom"), custom);
});

// =====================
// RESET DEFAULT
// =====================
document.getElementById("reset").addEventListener("click", () => {
    set(ref(db, "style/custom"), null);
});
