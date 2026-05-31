const subsPicker = document.getElementById("subsPicker");
const subsHex = document.getElementById("subsHex");

const bitsPicker = document.getElementById("bitsPicker");
const bitsHex = document.getElementById("bitsHex");

const frame = document.getElementById("frame");

// =====================
// COLOR SYNC SUBS
// =====================
subsPicker.addEventListener("input", () => {
    subsHex.value = subsPicker.value;
    updatePreview();
});

subsHex.addEventListener("input", () => {
    subsPicker.value = subsHex.value;
    updatePreview();
});

// =====================
// COLOR SYNC BITS
// =====================
bitsPicker.addEventListener("input", () => {
    bitsHex.value = bitsPicker.value;
    updatePreview();
});

bitsHex.addEventListener("input", () => {
    bitsPicker.value = bitsHex.value;
    updatePreview();
});

// =====================
// TEXTO
// =====================
document.getElementById("fontFamily").addEventListener("input", updatePreview);
document.getElementById("fontSize").addEventListener("input", updatePreview);

// =====================
// PREVIEW LIVE
// =====================
function updatePreview() {

    const subsColor = subsHex.value || "#9146FF";
    const bitsColor = bitsHex.value || "#FFD54F";

    const font = document.getElementById("fontFamily").value || "Arial";
    const size = document.getElementById("fontSize").value || 20;

    frame.contentWindow.postMessage({
        subsColor,
        bitsColor,
        font,
        size
    }, "*");
}

// =====================
// SAVE / RESET
// =====================
document.getElementById("save").addEventListener("click", () => {
    localStorage.setItem("overlayStyle", JSON.stringify({
        subs: subsHex.value,
        bits: bitsHex.value,
        font: document.getElementById("fontFamily").value,
        size: document.getElementById("fontSize").value
    }));
});

document.getElementById("reset").addEventListener("click", () => {
    localStorage.removeItem("overlayStyle");
    location.reload();
});
