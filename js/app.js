import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const statsRef = ref(db, "overlay");

onValue(statsRef, (snapshot) => {

    const data = snapshot.val();

    if(!data) return;

    document.getElementById("subs").innerText = data.subs ?? 0;
    document.getElementById("bits").innerText = data.bits ?? 0;
});
