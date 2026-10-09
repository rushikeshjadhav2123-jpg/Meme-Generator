
const imageInput = document.getElementById("imageInput");
const idea = document.getElementById("idea");
const mood = document.getElementById("mood");
const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");
const textColor = document.getElementById("textColor");
const fontSize = document.getElementById("fontSize");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

const generateButton = document.getElementById("generateButton");
const redrawButton = document.getElementById("redrawButton");
const downloadButton = document.getElementById("downloadButton");
const status = document.getElementById("status");
const emptyState = document.getElementById("emptyState");

let originalImage = null;
let imageDataURL = null;

function setStatus(message) {
  status.textContent = message;
}

function showCanvas() {
  canvas.hidden = false;
  emptyState.hidden = true;
}

function loadImage(dataURL) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = dataURL;
  });
}

imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    setStatus("Please choose a JPG, PNG or WEBP image.");
    imageInput.value = "";
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    setStatus("Image is too large. Choose an image under 8 MB.");
    imageInput.value = "";
    return;
  }

  try {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const img = await loadImage(reader.result);

        const maxDimension = 1200;
        const scale = Math.min(
          1,
          maxDimension / Math.max(img.width, img.height)
        );

        const temp = document.createElement("canvas");
        temp.width = Math.max(1, Math.round(img.width * scale));
        temp.height = Math.max(1, Math.round(img.height * scale));

        temp.getContext("2d").drawImage(
          img, 0, 0, temp.width, temp.height
        );

        imageDataURL = temp.toDataURL("image/jpeg", 0.85);
        originalImage = await loadImage(imageDataURL);

        document.getElementById("uploadTitle").textContent = "Image ready";
        document.getElementById("uploadInfo").textContent = file.name;

        drawMeme();
        setStatus("Image ready! Describe your meme and generate captions.");
      } catch (error) {
        setStatus(error.message || "Could not process this image.");
      }
    };

    reader.onerror = () => setStatus("Could not read the selected file.");
    reader.readAsDataURL(file);
  } catch {
    setStatus("Image upload failed.");
  }
});

function wrapText(text, maxWidth) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;

    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawCaption(text, y, position, size) {
  if (!text.trim()) return;

  const maxWidth = canvas.width * 0.9;
  const lines = wrapText(text.toUpperCase(), maxWidth);
  const lineHeight = size * 1.16;

  ctx.font = `900 ${size}px Impact, "Arial Black", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.fillStyle = textColor.value;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = Math.max(3, size * 0.09);

  if (position === "top") {
    y = Math.max(size / 2 + 8, y);
  } else {
    y = Math.min(canvas.height - size / 2 - 8, y);
  }

  lines.forEach((line, index) => {
    const lineY = position === "top"
      ? y + index * lineHeight
      : y - (lines.length - 1 - index) * lineHeight;

    ctx.strokeText(line, canvas.width / 2, lineY, maxWidth);
    ctx.fillText(line, canvas.width / 2, lineY, maxWidth);
  });
}

function drawMeme() {
  if (!originalImage) {
    setStatus("Upload an image first.");
    return;
  }

  const maxDimension = 1000;
  const scale = Math.min(
    1,
    maxDimension / Math.max(originalImage.width, originalImage.height)
  );

  canvas.width = Math.max(1, Math.round(originalImage.width * scale));
  canvas.height = Math.max(1, Math.round(originalImage.height * scale));

  ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

  const size = Number(fontSize.value) *
    (canvas.width / 800);

  const safeSize = Math.max(14, size);
  const margin = safeSize * 0.8;

  ctx.font = `900 ${safeSize}px Impact, "Arial Black", sans-serif`;

  drawCaption(
    topText.value,
    margin + safeSize / 2,
    "top",
    safeSize
  );

  drawCaption(
    bottomText.value,
    canvas.height - margin - safeSize / 2,
    "bottom",
    safeSize
  );

  showCanvas();
}

generateButton.addEventListener("click", async () => {
  if (!imageDataURL) {
    setStatus("Please upload an image first.");
    return;
  }

  if (!idea.value.trim()) {
    setStatus("Please describe the meme you want to create.");
    idea.focus();
    return;
  }

  generateButton.disabled = true;
  generateButton.textContent = "⏳ Generating...";
  setStatus("AI is analyzing your image and writing captions...");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: idea.value.trim(),
        mood: mood.value,
        image: imageDataURL
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI generation failed.");
    }

    topText.value = data.topText || "";
    bottomText.value = data.bottomText || "";

    drawMeme();
    setStatus("Meme generated successfully!");
  } catch (error) {
    setStatus(error.message || "Could not connect to the AI service.");
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "✨ Generate with AI";
  }
});

redrawButton.addEventListener("click", drawMeme);

[topText, bottomText, textColor, fontSize].forEach((element) => {
  element.addEventListener("input", () => {
    if (originalImage) drawMeme();
  });
});

downloadButton.addEventListener("click", () => {
  if (!originalImage) {
    setStatus("Upload an image before downloading.");
    return;
  }

  drawMeme();

  const link = document.createElement("a");
  link.download = "memeai-creation.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

  setStatus("Your PNG download has been started.");
});
