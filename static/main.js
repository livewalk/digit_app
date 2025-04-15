const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// canvas.addEventListener("mousedown", () => drawing = true);
// canvas.addEventListener("mouseup", () => drawing = false);
// canvas.addEventListener("mousemove", draw);

// function draw(e) {
//   if (!drawing) return;
//   ctx.lineWidth = 12;
//   ctx.lineCap = "round";
//   ctx.strokeStyle = "black";
//   ctx.lineTo(e.offsetX, e.offsetY);
//   ctx.stroke();
//   ctx.beginPath();
//   ctx.moveTo(e.offsetX, e.offsetY);
// }

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseout", () => isDrawing = false);


document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// document.getElementById("send").addEventListener("click", async () => {
//   const dataURL = canvas.toDataURL("image/png");
//   const response = await fetch("/predict", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ image: dataURL }),
//   });

//   const result = await response.json();
//   document.getElementById("status").textContent =
//   result.message + " Size: " + result.size + " | Predicted: " + result.class + " | Confidence: " + Math.round(result.confidence * 100) + "%";
//   console.log(result);
//   alert(`Predicted: ${result.class} with ${Math.round(result.confidence * 100)}% confidence`);
// });

document.getElementById("send").addEventListener("click", async () => {
  // Create a temporary canvas with same size
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Fill white background
  tempCtx.fillStyle = "white";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw original canvas on top
  tempCtx.drawImage(canvas, 0, 0);

  // Export image from temp canvas
  const dataURL = tempCanvas.toDataURL("image/png");
  console.log(dataURL);

  const response = await fetch("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: dataURL }),
  });

  const result = await response.json();
  document.getElementById("status").textContent =
    result.message + " Size: " + result.size + " | Predicted: " + result.class + " | Confidence: " + result.confidence * 100 + "%";

  console.log(result);
  //alert(`Predicted: ${result.class} with ${Math.round(result.confidence * 100)}% confidence`);
});

 
  