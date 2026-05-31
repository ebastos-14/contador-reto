import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// =========================
// FIREBASE CONFIG
// =========================
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

// =========================
// DEFAULT CSS → FIREBASE FORMAT
// =========================
const DEFAULT_STYLE = {
    gradientAngle: "45deg",

    border: {
        c1: "#9146FF",
        c2: "#ff4fd8"
    },

    shadow: {
        c1: "rgba(145,70,255,0.6)",
        c2: "rgba(255,79,216,0.2)"
    },

    labelText: {
        c1: "#ffb3d9",
        c2: "#ffffff"
    },

    valueText: {
        c1: "#ffffff",
        c2: "#ffb3d9"
    }
};

// =========================
// INIT DEFAULT (SAFE)
// =========================
async function initDefault() {

    const refDefault = ref(db, "style/default");
    const snap = await get(refDefault);

    if (!snap.exists()) {
        await set(refDefault, DEFAULT_STYLE);
        console.log("✔ Default CSS guardado en Firebase");
    } else {
        console.log("✔ Default ya existe, no se sobrescribe");
    }
}

// =========================
// SAVE CUSTOM THEME
// =========================
export async function saveCustomTheme(customData) {

    const refCustom = ref(db, "style/custom");

    await set(refCustom, customData);

    console.log("✔ Custom theme guardado");
}

// =========================
// LOAD ACTIVE THEME (custom > default)
// =========================
export async function loadTheme() {

    const customRef = ref(db, "style/custom");
    const defaultRef = ref(db, "style/default");

    const [customSnap, defaultSnap] = await Promise.all([
        get(customRef),
        get(defaultRef)
    ]);

    const custom = customSnap.exists() ? customSnap.val() : null;
    const def = defaultSnap.exists() ? defaultSnap.val() : DEFAULT_STYLE;

    return custom || def;
}

// =========================
// APPLY TO CSS VARIABLES
// =========================
export function applyTheme(theme) {

    const root = document.documentElement;

    const angle = theme.gradientAngle || "45deg";

    root.style.setProperty("--gradient-angle", angle);

    root.style.setProperty(
        "--border-gradient",
        `linear-gradient(${angle}, ${theme.border.c1}, ${theme.border.c2})`
    );

    root.style.setProperty(
        "--shadow-gradient",
        `linear-gradient(${angle}, ${theme.shadow.c1}, ${theme.shadow.c2})`
    );

    root.style.setProperty(
        "--label-gradient",
        `linear-gradient(${angle}, ${theme.labelText.c1}, ${theme.labelText.c2})`
    );

    root.style.setProperty(
        "--value-gradient",
        `linear-gradient(${angle}, ${theme.valueText.c1}, ${theme.valueText.c2})`
    );
}

// =========================
// RUN INIT
// =========================
initDefault();
