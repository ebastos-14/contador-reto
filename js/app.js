import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    onValue,
    get,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const countersRef = ref(db, "counters");

function getUTCDate() {
    return new Date().toISOString().split("T")[0];
}

async function checkDailyReset() {

    const snap = await get(countersRef);
    const data = snap.val();

    if (!data) return;

    const today = getUTCDate();

    const lastReset =
        data?.current?.lastReset || today;

    if (lastReset === today) return;

    await set(countersRef, {

        current: {
            subs: 0,
            bits: 0,
            avas: 0,
            cofres: 0,
            lastReset: today
        },

        total: {
            subs: data?.total?.subs || 0,
            bits: data?.total?.bits || 0,
            avas: data?.total?.avas || 0,
            cofres: data?.total?.cofres || 0
        }
    });

    console.log("UTC reset ejecutado");
}

await checkDailyReset();

onValue(countersRef, async (snapshot) => {

    const data = snapshot.val();

    if (!data) return;

    const today = getUTCDate();

    if (data?.current?.lastReset !== today) {
        await checkDailyReset();
        return;
    }

    // ======================
    // CURRENT
    // ======================

    const subsCurrent =
        document.getElementById("subsCurrent");

    if (subsCurrent) {
        subsCurrent.textContent =
            data?.current?.subs ?? 0;
    }

    const bitsCurrent =
        document.getElementById("bitsCurrent");

    if (bitsCurrent) {
        bitsCurrent.textContent =
            data?.current?.bits ?? 0;
    }

    const avasCurrent =
        document.getElementById("avasCurrent");

    if (avasCurrent) {
        avasCurrent.textContent =
            data?.current?.avas ?? 0;
    }

    const cofresCurrent =
        document.getElementById("cofresCurrent");

    if (cofresCurrent) {
        cofresCurrent.textContent =
            data?.current?.cofres ?? 0;
    }

    // ======================
    // TOTAL
    // ======================

    const subsTotal =
        document.getElementById("subsTotal");

    if (subsTotal) {
        subsTotal.textContent =
            data?.total?.subs ?? 0;
    }

    const bitsTotal =
        document.getElementById("bitsTotal");

    if (bitsTotal) {
        bitsTotal.textContent =
            data?.total?.bits ?? 0;
    }

    const avasTotal =
        document.getElementById("avasTotal");

    if (avasTotal) {
        avasTotal.textContent =
            data?.total?.avas ?? 0;
    }

    const cofresTotal =
        document.getElementById("cofresTotal");

    if (cofresTotal) {
        cofresTotal.textContent =
            data?.total?.cofres ?? 0;
    }

});
