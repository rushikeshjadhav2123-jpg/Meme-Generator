/* =========================================
   MEME STUDIO PRO — FIXED IMAGE GENERATOR
   No API key required
   Funny cartoon + top & bottom captions
   ========================================= */
"use strict";
const canvas = document.getElementById("memeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let uploadedImage = null;
let currentScene = 0;
const funnyMemes = [
  {
    top: "ME: AAJ SE PADHAI START 😂",
    bottom: "ALSO ME: KAL SE PAKKA 💀"
  },
  {
    top: "WHEN MOM SAYS GUESTS ARE COMING",
    bottom: "CLEAN THE WHOLE HOUSE 😭"
  },
  {
    top: "SALARY CREDITED 💰",
    bottom: "BANK BALANCE AFTER 2 DAYS 💀"
  },
  {
    top: "ME CHECKING MY EXAM PAPER",
    bottom: "YE QUESTION SYLLABUS ME THA?! 😭"
  },
  {
    top: "FRIEND: BHAI 5 MINUTES",
    bottom: "ARRIVES AFTER 2 HOURS 💀"
  },
  {
    top: "ME ACTING NORMAL",
    bottom: "AFTER DOING SOMETHING STUPID 😂"
  }
];
function getElement(id) {
  return document.getElementById(id);
}
function setStatus(message) {
  const status = getElement("status") || getElement("statusText");
  if (status) status.textContent = message;
}
function getCaptions() {
  const topInput = getElement("topText");
  const bottomInput = getElement("bottomText");
  let top = topInput && topInput.value.trim();
  let bottom = bottomInput && bottomInput.value.trim();
  if (!top || !bottom) {
    const idea = getElement("idea");
    const prompt = idea ? idea.value.trim().toLowerCase() : "";
    let meme;
    if (prompt.includes("exam") || prompt.includes("study")) {
      meme = funnyMemes[3];
    } else if (prompt.includes("money") || prompt.includes("salary")) {
      meme = funnyMemes[2];
    } else if (prompt.includes("friend")) {
      meme = funnyMemes[4];
    } else if (prompt.includes("mom")) {
      meme = funnyMemes[1];
    } else {
      meme = funnyMemes[currentScene % funnyMemes.length];
    }
    if (!top) top = meme.top;
    if (!bottom) bottom = meme.bottom;
  }
  return { top, bottom };
}
/* Set up the canvas */
function setupCanvas() {
  if (!canvas || !ctx) {
    console.error('Canvas with id="memeCanvas" was not found.');
    setStatus('Error: memeCanvas not found in index.html');
    return false;
  }
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.maxWidth = "800px";
  canvas.style.height = "auto";
  canvas.style.background = "#fff";
  return true;
}
/* Draw a funny cartoon character */
function drawCartoon() {
  const w = canvas.width;
  const h = canvas.height;
  // Background
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#ffe082");
  gradient.addColorStop(1, "#ff9a9e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  // Decorative circles
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.arc(
      (i * 137 + 55) % w,
      (i * 83 + 35) % h,
      18 + (i % 4) * 8,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Cartoon body
  ctx.fillStyle = "#3478f6";
  ctx.beginPath();
  ctx.ellipse(400, 485, 145, 130, 0, 0, Math.PI * 2);
  ctx.fill();
  // Neck
  ctx.fillStyle = "#f3bd8c";
  ctx.fillRect(365, 375, 70, 75);
  // Ears
  ctx.fillStyle = "#f3bd8c";
  ctx.beginPath();
  ctx.ellipse(285, 275, 32, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(515, 275, 32, 48, 0, 0, Math.PI * 2);
  ctx.fill();
  // Face
  ctx.fillStyle = "#ffd2a6";
  ctx.beginPath();
  ctx.ellipse(400, 285, 125, 145, 0, 0, Math.PI * 2);
  ctx.fill();
  // Hair
  ctx.fillStyle = "#29233a";
  ctx.beginPath();
  ctx.arc(400, 205, 115, Math.PI, Math.PI * 2);
  ctx.lineTo(515, 255);
  ctx.quadraticCurveTo(470, 225, 455, 240);
  ctx.quadraticCurveTo(420, 195, 385, 238);
  ctx.quadraticCurveTo(335, 205, 290, 260);
  ctx.closePath();
  ctx.fill();
  // Eyebrows
  ctx.strokeStyle = "#29233a";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(325, 258);
  ctx.lineTo(365, 269);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(435, 269);
  ctx.lineTo(475, 258);
  ctx.stroke();
  // Big cartoon eyes
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(355, 294, 30, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(445, 294, 30, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pupils
  ctx.fillStyle = "#29233a";
  ctx.beginPath();
  ctx.arc(365, 303, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(455, 303, 15, 0, Math.PI * 2);
  ctx.fill();
  // Eye shine
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(370, 297, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(460, 297, 5, 0, Math.PI * 2);
  ctx.fill();
  // Nose
  ctx.fillStyle = "#e99b7c";
  ctx.beginPath();
  ctx.moveTo(400, 305);
  ctx.lineTo(385, 340);
  ctx.quadraticCurveTo(400, 350, 415, 340);
  ctx.closePath();
  ctx.fill();
  // Huge goofy open mouth
  ctx.fillStyle = "#5a1835";
  ctx.beginPath();
  ctx.ellipse(400, 373, 48, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  // Teeth
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(373, 346, 54, 17, 5);
  ctx.fill();
  // Tongue
  ctx.fillStyle = "#ff6584";
  ctx.beginPath();
  ctx.ellipse(400, 389, 24, 12, 0, 0, Math.PI);
  ctx.fill();
  // Cheeks
  ctx.fillStyle = "#ff8e9e";
  ctx.beginPath();
  ctx.ellipse(315, 335, 24, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(485, 335, 24, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  // Funny sweat drops
  ctx.fillStyle = "#40c9ff";
  ctx.beginPath();
  ctx.ellipse(535, 245, 10, 19, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(555, 280, 7, 13, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Little arms
  ctx.strokeStyle = "#ffd2a6";
  ctx.lineWidth = 24;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(300, 465);
  ctx.lineTo(245, 420);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(500, 465);
  ctx.lineTo(555, 420);
  ctx.stroke();
  // Hands
  ctx.fillStyle = "#ffd2a6";
  ctx.beginPath();
  ctx.arc(240, 415, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(560, 415, 20, 0, Math.PI * 2);
  ctx.fill();
  // Comic-style laugh marks
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px Arial";
  ctx.fillText("?!", 565, 205);
  ctx.fillText("😂", 185, 310);
  // Caption panel behind the character
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(0, 440, w, 160);
}
/* Draw text with outline and wrapping */
function drawCaption(text, y, maxWidth, fontSize) {
  if (!text) return;
  const words = text.toUpperCase().split(/\s+/);
  const lines = [];
  let line = "";
  ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const lineHeight = fontSize * 1.08;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  lines.forEach((lineText, i) => {
    const lineY = startY + i * lineHeight;
    ctx.lineWidth = Math.max(4, fontSize / 8);
    ctx.strokeStyle = "#000000";
    ctx.strokeText(lineText, canvas.width / 2, lineY, maxWidth);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(lineText, canvas.width / 2, lineY, maxWidth);
  });
}
/* Render cartoon or uploaded photo */
function renderMeme() {
  if (!setupCanvas()) return;
  if (uploadedImage) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imageRatio = uploadedImage.width / uploadedImage.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth, drawHeight, x, y;
    if (imageRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imageRatio;
      x = (canvas.width - drawWidth) / 2;
      y = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imageRatio;
      x = 0;
      y = (canvas.height - drawHeight) / 2;
    }
    ctx.drawImage(uploadedImage, x, y, drawWidth, drawHeight);
  } else {
    drawCartoon();
  }
  const captions = getCaptions();
  const sizeInput = getElement("fontSize");
  const customSize = sizeInput ? Number(sizeInput.value) : 0;
  const fontSize = customSize > 0 ? Math.min(customSize, 60) : 36;
  // Dark transparent bars improve caption visibility
  ctx.fillStyle = "rgba(0,0,0,0.48)";
  ctx.fillRect(0, 0, canvas.width, 100);
  ctx.fillRect(0, canvas.height - 105, canvas.width, 105);
  drawCaption(captions.top, 50, canvas.width - 35, fontSize);
  drawCaption(captions.bottom, canvas.height - 52, canvas.width - 35, fontSize);
  const emptyState = getElement("emptyState");
  if (emptyState) emptyState.style.display = "none";
  canvas.style.display = "block";
}
/* Generate a new meme */
function generateMeme() {
  currentScene++;
  uploadedImage = uploadedImage || null;
  const topInput = getElement("topText");
  const bottomInput = getElement("bottomText");
  const idea = getElement("idea");
  // If both captions are empty, choose a funny default
  if (
    (!topInput || !topInput.value.trim()) &&
    (!bottomInput || !bottomInput.value.trim()) &&
    (!idea || !idea.value.trim())
  ) {
    const meme = funnyMemes[currentScene % funnyMemes.length];
    if (topInput) topInput.value = meme.top;
    if (bottomInput) bottomInput.value = meme.bottom;
  }
  renderMeme();
  setStatus("😂 Funny meme generated successfully!");
}
/* Upload a photo */
function handleImageUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus("Please select a valid image file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      uploadedImage = img;
      renderMeme();
      setStatus("Image uploaded! Your meme is ready 😂");
      const title = getElement("uploadTitle");
      const info = getElement("uploadInfo");
      if (title) title.textContent = "Image ready";
      if (info) info.textContent = file.name;
    };
    img.onerror = function () {
      setStatus("Could not load this image. Try another photo.");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
/* Download the generated meme */
function downloadMeme() {
  if (!canvas || !ctx) {
    setStatus("Canvas not found. Check index.html.");
    return;
  }
  // Ensure the canvas contains the latest meme
  renderMeme();
  const link = document.createElement("a");
  link.download = "funny-meme.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  setStatus("Meme downloaded!");
}
/* Reset the editor */
function resetMeme() {
  uploadedImage = null;
  const topInput = getElement("topText");
  const bottomInput = getElement("bottomText");
  const idea = getElement("idea");
  const imageInput = getElement("imageInput");
  if (topInput) topInput.value = "";
  if (bottomInput) bottomInput.value = "";
  if (idea) idea.value = "";
  if (imageInput) imageInput.value = "";
  renderMeme();
  setStatus("Ready! Generate a new funny meme 😂");
}
/* Connect existing HTML buttons */
function connectButton(ids, callback) {
  for (const id of ids) {
    const element = getElement(id);
    if (element) {
      element.addEventListener("click", callback);
      return;
    }
  }
}
connectButton(["generateButton"], generateMeme);
connectButton(["redrawButton", "resetButton"], resetMeme);
connectButton(["downloadButton"], downloadMeme);
const imageInput = getElement("imageInput");
if (imageInput) {
  imageInput.addEventListener("change", handleImageUpload);
}
// Update the meme when caption fields change
["topText", "bottomText", "fontSize", "textColor", "mood"].forEach((id) => {
  const element = getElement(id);
  if (element) {
    element.addEventListener("input", () => {
      if (canvas) renderMeme();
    });
    element.addEventListener("change", () => {
      if (canvas) renderMeme();
    });
  }
});
// Show a cartoon immediately when the page loads
if (canvas && ctx) {
  setupCanvas();
  renderMeme();
  setStatus("Ready! Click Generate Meme 😂");
} else {
  console.error(
    'Meme Studio: Add <canvas id="memeCanvas"></canvas> to index.html.'
  );
  setStatus("Canvas missing: check index.html for id=memeCanvas");
}
