const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("send").addEventListener("click", async () => {
  const dataURL = canvas.toDataURL("image/png");
  const response = await fetch("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: dataURL }),
  });

  const result = await response.json();
  document.getElementById("status").textContent = result.message + " Size: " + result.size;
});

fetch("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: canvas.toDataURL("image/png") })
  })
  .then(response => response.json())
  .then(data => {
    if (data.digit !== undefined) {
      alert(`Predicted: ${data.digit} with ${Math.round(data.confidence * 100)}% confidence`);
    } else {
      console.error("Prediction error:", data.error);
    }
  });
  