/* ==========================================
   MEMEAI STUDIO
   Fixed Canvas + Funny Cartoon + Captions
   No API key required
   ========================================== */
"use strict";
const canvas = document.getElementById("memeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const $ = (id) => document.getElementById(id);
let uploadedImage = null;
let sceneIndex = 0;
const memes = [
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
    top: "ME IN THE EXAM HALL",
    bottom: "YE QUESTION KABHI DEKHA HI NAHI 😭"
  },
  {
    top: "FRIEND: BAS 5 MINUTES",
    bottom: "2 HOURS LATER 💀"
  },
  {
    top: "ME ACTING NORMAL",
    bottom: "AFTER DOING SOMETHING STUPID 😂"
  }
];
function setStatus(message) {
  const status = $("status");
  if (status) status.textContent = message;
}
function setupCanvas() {
  if (!canvas || !ctx) {
    setStatus("Error: memeCanvas not found in HTML.");
    console.error("Canvas element missing.");
    return false;
  }
  canvas.width = 800;
  canvas.height = 600;
  // Critical fix: remove the HTML hidden attribute
  canvas.hidden = false;
  canvas.style.display = "block";
  canvas.style.visibility = "visible";
  canvas.style.opacity = "1";
  canvas.style.width = "100%";
  canvas.style.maxWidth = "800px";
  canvas.style.height = "auto";
  return true;
}
function getCaptions() {
  const topInput = $("topText");
  const bottomInput = $("bottomText");
  const idea = $("idea");
  let top = topInput ? topInput.value.trim() : "";
  let bottom = bottomInput ? bottomInput.value.trim() : "";
  const prompt = idea ? idea.value.toLowerCase() : "";
  let meme = memes[sceneIndex % memes.length];
  if (prompt.includes("exam") || prompt.includes("study")) {
    meme = memes[3];
  } else if (prompt.includes("money") || prompt.includes("salary")) {
    meme = memes[2];
  } else if (prompt.includes("friend")) {
    meme = memes[4];
  } else if (prompt.includes("mom")) {
    meme = memes[1];
  }
  if (!top) top = meme.top;
  if (!bottom) bottom = meme.bottom;
  return { top, bottom };
}
/* Draw a funny cartoon face */
function drawCartoon() {
  const w = canvas.width;
  const h = canvas.height;
  // Colourful background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#ffd86b");
  bg.addColorStop(1, "#ff8caa");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  // Background decoration
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.arc(
      (i * 137 + 45) % w,
      (i * 91 + 35) % h,
      15 + (i % 4) * 8,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  // Body
  ctx.fillStyle = "#536dfe";
  ctx.beginPath();
  ctx.ellipse(400, 490, 155, 130, 0, 0, Math.PI * 2);
  ctx.fill();
  // Neck
  ctx.fillStyle = "#f2b98c";
  ctx.fillRect(365, 385, 70, 65);
  // Ears
  ctx.beginPath();
  ctx.ellipse(285, 290, 28, 43, 0, 0, Math.PI * 2);
  ctx.ellipse(515, 290, 28, 43, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#f2b98c";
  ctx.fill();
  // Face
  ctx.beginPath();
  ctx.ellipse(400, 290, 120, 145, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#ffd0a3";
  ctx.fill();
  // Hair
  ctx.fillStyle = "#30233f";
  ctx.beginPath();
  ctx.arc(400, 235, 112, Math.PI, Math.PI * 2);
  ctx.lineTo(510, 270);
  ctx.quadraticCurveTo(480, 230, 450, 250);
  ctx.quadraticCurveTo(415, 200, 380, 245);
  ctx.quadraticCurveTo(330, 220, 290, 270);
  ctx.closePath();
  ctx.fill();
  // Eyebrows
  ctx.strokeStyle = "#30233f";
  ctx.lineWidth = 11;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(325, 260);
  ctx.lineTo(365, 270);
  ctx.moveTo(435, 270);
  ctx.lineTo(475, 260);
  ctx.stroke();
  // Eyes
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(355, 295, 29, 36, 0, 0, Math.PI * 2);
  ctx.ellipse(445, 295, 29, 36, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pupils
  ctx.fillStyle = "#29213b";
  ctx.beginPath();
  ctx.arc(365, 305, 15, 0, Math.PI * 2);
  ctx.arc(455, 305, 15, 0, Math.PI * 2);
  ctx.fill();
  // Eye shine
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(370, 299, 5, 0, Math.PI * 2);
  ctx.arc(460, 299, 5, 0, Math.PI * 2);
  ctx.fill();
  // Nose
  ctx.fillStyle = "#e99b7c";
  ctx.beginPath();
  ctx.moveTo(400, 315);
  ctx.lineTo(385, 342);
  ctx.quadraticCurveTo(400, 351, 415, 342);
  ctx.closePath();
  ctx.fill();
  // Big goofy mouth
  ctx.fillStyle = "#5b1935";
  ctx.beginPath();
  ctx.ellipse(400, 375, 48, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  // Teeth
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(374, 348, 52, 17, 5);
  ctx.fill();
  // Tongue
  ctx.fillStyle = "#ff6584";
  ctx.beginPath();
  ctx.ellipse(400, 393, 24, 12, 0, 0, Math.PI);
  ctx.fill();
  // Blushing cheeks
  ctx.fillStyle = "#ff829b";
  ctx.beginPath();
  ctx.ellipse(315, 340, 22, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(485, 340, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Sweat drops
  ctx.fillStyle = "#22b9ff";
  ctx.beginPath();
  ctx.ellipse(535, 250, 9, 18, -0.4, 0, Math.PI * 2);
  ctx.ellipse(555, 285, 7, 13, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Arms
  ctx.strokeStyle = "#ffd0a3";
  ctx.lineWidth = 25;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(300, 465);
  ctx.lineTo(245, 420);
  ctx.moveTo(500, 465);
  ctx.lineTo(555, 420);
  ctx.stroke();
  // Hands
  ctx.fillStyle = "#ffd0a3";
  ctx.beginPath();
  ctx.arc(240, 415, 20, 0, Math.PI * 2);
  ctx.arc(560, 415, 20, 0, Math.PI * 2);
  ctx.fill();
  // Comic symbols
  ctx.font = "bold 45px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("?!", 560, 210);
  ctx.fillText("😂", 175, 320);
}
/* Draw outlined, wrapped meme captions */
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
  lines.forEach((item, index) => {
    const lineY = startY + index * lineHeight;
    ctx.lineWidth = Math.max(4, fontSize / 7);
    ctx.strokeStyle = "#000000";
    ctx.strokeText(item, canvas.width / 2, lineY, maxWidth);
    ctx.fillStyle = $("textColor")?.value || "#ffffff";
    ctx.fillText(item, canvas.width / 2, lineY, maxWidth);
  });
}
/* Render photo or generated cartoon */
function renderMeme() {
  if (!setupCanvas()) return;
  if (uploadedImage) {
    const ratio = uploadedImage.width / uploadedImage.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth, drawHeight, x, y;
    if (ratio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * ratio;
      x = (canvas.width - drawWidth) / 2;
      y = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / ratio;
      x = 0;
      y = (canvas.height - drawHeight) / 2;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, x, y, drawWidth, drawHeight);
  } else {
    drawCartoon();
  }
  const { top, bottom } = getCaptions();
  const size = Number($("fontSize")?.value) || 38;
  const fontSize = Math.min(size, 58);
  // Caption background bars
  ctx.fillStyle = "rgba(0,0,0,0.52)";
  ctx.fillRect(0, 0, canvas.width, 105);
  ctx.fillRect(0, canvas.height - 110, canvas.width, 110);
  drawCaption(top, 52, canvas.width - 35, fontSize);
  drawCaption(bottom, canvas.height - 55, canvas.width - 35, fontSize);
  // Critical blank-canvas fix
  canvas.hidden = false;
  canvas.style.display = "block";
  canvas.style.visibility = "visible";
  canvas.style.opacity = "1";
  const emptyState = $("emptyState");
  if (emptyState) emptyState.style.display = "none";
}
/* Generate a meme */
function generateMeme() {
  sceneIndex++;
  const topInput = $("topText");
  const bottomInput = $("bottomText");
  const idea = $("idea");
  if (
    (!topInput || !topInput.value.trim()) &&
    (!bottomInput || !bottomInput.value.trim()) &&
    (!idea || !idea.value.trim())
  ) {
    const meme = memes[sceneIndex % memes.length];
    if (topInput) topInput.value = meme.top;
    if (bottomInput) bottomInput.value = meme.bottom;
  }
  renderMeme();
  setStatus("😂 Funny meme generated successfully!");
}
/* Load uploaded image */
function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus("Please select a valid image.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      uploadedImage = img;
      renderMeme();
      if ($("uploadTitle")) {
        $("uploadTitle").textContent = "Image ready";
      }
      if ($("uploadInfo")) {
        $("uploadInfo").textContent = file.name;
      }
      setStatus("Image uploaded! Add captions or generate a meme.");
    };
    img.onerror = function () {
      setStatus("Image could not be loaded. Try another image.");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
/* Download PNG */
function downloadMeme() {
  if (!canvas || !ctx) {
    setStatus("Canvas is missing from index.html.");
    return;
  }
  renderMeme();
  try {
    const link = document.createElement("a");
    link.download = "MemeAI-funny-meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("Meme downloaded successfully!");
  } catch (error) {
    setStatus("Download failed. Please try again.");
    console.error(error);
  }
}
/* Reset editor */
function resetMeme() {
  uploadedImage = null;
  ["topText", "bottomText", "idea"].forEach((id) => {
    if ($(id)) $(id).value = "";
  });
  if ($("imageInput")) $("imageInput").value = "";
  if ($("uploadTitle")) {
    $("uploadTitle").textContent = "Choose an image";
  }
  if ($("uploadInfo")) {
    $("uploadInfo").textContent = "PNG, JPG or WEBP";
  }
  renderMeme();
  setStatus("Ready! Generate a funny meme 😂");
}
/* Connect controls */
$("generateButton")?.addEventListener("click", generateMeme);
$("redrawButton")?.addEventListener("click", renderMeme);
$("downloadButton")?.addEventListener("click", downloadMeme);
$("imageInput")?.addEventListener("change", handleImageUpload);
["topText", "bottomText", "fontSize", "textColor"].forEach((id) => {
  $(id)?.addEventListener("input", renderMeme);
});
// Initial render on page load
if (canvas && ctx) {
  renderMeme();
  setStatus("Ready! Click Generate with AI to create a funny meme 😂");
} else {
  console.error('Please check for <canvas id="memeCanvas"> in index.html.');
  setStatus("Canvas missing. Please check index.html.");
}
