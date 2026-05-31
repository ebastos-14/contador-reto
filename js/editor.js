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

// =====================
// REFERENCIA FIREBASE
// =====================
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

const frame = document.getElementById("frame");

// =====================
// ESTADO LOCAL
// =====================
let state = {
    default: {
        subsColor: "#9146FF",
        bitsColor: "#FFD54F",
        font: "Arial",
        size: 24
    },
    custom: null
};

// =====================
// LEER FIREBASE
// =====================
onValue(styleRef, (snap) => {
    const data = snap.val();

    if (!data) {
        // si no existe, crear default
        set(styleRef, state);
        return;
    }

    state = data;

    const active = state.custom || state.default;

    loadInputs(active);
    applyPreview(active);
});

// =====================
// CARGAR INPUTS
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
// PREVIEW VISUAL (EDITOR)
// =====================
function applyPreview(style) {

    document.getElementById("subsCurrent").style.background = style.subsColor;
    document.getElementById("bitsCurrent").style.background = style.bitsColor;

    document.getElementById("fontPreview").style.fontFamily = style.font;
    document.getElementById("fontPreview").style.fontSize = style.size + "px";
}

// =====================
// UPDATE LIVE STATE
// =====================
function getCurrentInputStyle() {
    return {
        subsColor: subsHex.value,
        bitsColor: bitsHex.value,
        font: fontFamily.value,
        size: Number(fontSize.value)
    };
}

// =====================
// INPUT EVENTS
// =====================

// subs
subsPicker.addEventListener("input", () => {
    subsHex.value = subsPicker.value;
    livePreview();
});

subsHex.addEventListener("input", () => {
    subsPicker.value = subsHex.value;
    livePreview();
});

// bits
bitsPicker.addEventListener("input", () => {
    bitsHex.value = bitsPicker.value;
    livePreview();
});

bitsHex.addEventListener("input", () => {
    bitsPicker.value = bitsHex.value;
    livePreview();
});

// font
fontFamily.addEventListener("input", livePreview);
fontSize.addEventListener("input", livePreview);

// =====================
// LIVE PREVIEW (SIN GUARDAR)
// =====================
function livePreview() {
    const style = getCurrentInputStyle();
    applyPreview(style);
}

// =====================
// GUARDAR CUSTOM
// =====================
document.getElementById("save").addEventListener("click", () => {

    const custom = getCurrentInputStyle();

    set(ref(db, "style/custom"), custom);
});

// =====================
// RESET A DEFAULT
// =====================
document.getElementById("reset").addEventListener("click", () => {

    set(ref(db, "style/custom"), null);
});
