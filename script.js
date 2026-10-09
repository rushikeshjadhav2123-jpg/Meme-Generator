
"use strict";

const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

const topInput = document.getElementById("topText");
const bottomInput = document.getElementById("bottomText");
const imageInput = document.getElementById("imageInput");
const fontSizeInput = document.getElementById("fontSize");
const sizeValue = document.getElementById("sizeValue");
const textColorInput = document.getElementById("textColor");
const animationInput = document.getElementById("animation");
const durationInput = document.getElementById("duration");
const outlineInput = document.getElementById("outline");
const uppercaseInput = document.getElementById("uppercase");
const statusBox = document.getElementById("status");
const templates = [...document.querySelectorAll(".template")];

let uploadedImage = null;
let selectedEmoji = "😂";
let selectedBackground = "#5141a8";
let animationFrame = null;
let animationStart = performance.now();
let isExporting = false;

function setStatus(message) {
  statusBox.textContent = message;
}

function stopAnimation() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

function drawBackground() {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, selectedBackground);
  gradient.addColorStop(1, "#171d39");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  if (uploadedImage) {
    const scale = Math.max(w / uploadedImage.width, h / uploadedImage.height);
    const dw = uploadedImage.width * scale;
    const dh = uploadedImage.height * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();
    ctx.drawImage(uploadedImage, (w - dw) / 2, (h - dh) / 2, dw, dh);
    ctx.fillStyle = "rgba(0,0,0,0.20)";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  } else {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "180px Arial";
    ctx.fillText(selectedEmoji, w / 2, h / 2);
    ctx.restore();

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(90, 90, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - 90, h - 90, 100, 0, Math.PI * 2);
    ctx.fill();
  }
}

function wrapText(text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? line + " " + word : word;

    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawCaption(text, y, fontSize, scale = 1) {
  if (!text.trim()) return;

  const output = uppercaseInput.checked ? text.toUpperCase() : text;
  const size = fontSize * scale;

  ctx.save();
  ctx.font = `900 ${size}px Impact, "Arial Black", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColorInput.value;
  ctx.lineJoin = "round";

  const lines = wrapText(output, canvas.width * 0.88);
  const lineHeight = size * 1.12;
  let startY = y - ((lines.length - 1) * lineHeight) / 2;

  if (y < canvas.height / 2) {
    startY = Math.max(size / 2 + 8, startY);
  } else {
    startY = Math.min(
      canvas.height - size / 2 - 8 - (lines.length - 1) * lineHeight,
      startY
    );
  }

  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;

    if (outlineInput.checked) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = Math.max(3, size * 0.12);
      ctx.strokeText(line, canvas.width / 2, lineY, canvas.width * 0.9);
    }

    ctx.fillText(line, canvas.width / 2, lineY, canvas.width * 0.9);
  });

  ctx.restore();
}

function renderMeme(time = 0) {
  drawBackground();

  let topY = 65;
  let bottomY = canvas.height - 65;
  let scale = 1;

  if (animationInput.value === "bounce") {
    topY += Math.sin(time / 180) * 12;
    bottomY -= Math.sin(time / 180) * 12;
  } else if (animationInput.value === "pulse") {
    scale = 1 + Math.sin(time / 180) * 0.08;
  }

  const size = Number(fontSizeInput.value);
  drawCaption(topInput.value, topY, size, scale);
  drawCaption(bottomInput.value, bottomY, size, scale);
}

function redraw() {
  renderMeme(performance.now() - animationStart);
}

function startAnimation() {
  stopAnimation();
  animationStart = performance.now();

  function tick(now) {
    renderMeme(now - animationStart);

    if (animationInput.value !== "none" && !isExporting) {
      animationFrame = requestAnimationFrame(tick);
    } else {
      animationFrame = null;
    }
  }

  tick(performance.now());
}

// Templates
templates.forEach((button) => {
  button.addEventListener("click", () => {
    templates.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    selectedEmoji = button.dataset.emoji || "😂";
    selectedBackground = button.dataset.bg || "#5141a8";
    topInput.value = button.dataset.top || "";
    bottomInput.value = button.dataset.bottom || "";

    uploadedImage = null;
    imageInput.value = "";

    startAnimation();
    setStatus("Template selected!");
  });
});

// Upload photo
imageInput.addEventListener("change", () => {
  const file = imageInput.files && imageInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus("Please select a valid image.");
    imageInput.value = "";
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    setStatus("Choose an image smaller than 20 MB.");
    imageInput.value = "";
    return;
  }

  setStatus("Loading photo...");

  const reader = new FileReader();

  reader.onerror = () => setStatus("Could not read this file.");

  reader.onload = () => {
    const image = new Image();

    image.onload = () => {
      uploadedImage = image;
      templates.forEach((item) => item.classList.remove("active"));
      startAnimation();
      setStatus("Photo uploaded successfully!");
    };

    image.onerror = () => setStatus("This image could not be opened.");
    image.src = reader.result;
  };

  reader.readAsDataURL(file);
});

// Live editing
[
  topInput, bottomInput, textColorInput,
  animationInput, outlineInput, uppercaseInput
].forEach((element) => {
  element.addEventListener("input", startAnimation);
  element.addEventListener("change", startAnimation);
});

fontSizeInput.addEventListener("input", () => {
  sizeValue.textContent = fontSizeInput.value;
  startAnimation();
});

durationInput.addEventListener("change", () => {
  setStatus("Duration set to " + durationInput.value + " seconds.");
});

// Reset
document.getElementById("resetBtn").addEventListener("click", () => {
  topInput.value = "WHEN LIFE GIVES YOU BUGS";
  bottomInput.value = "CALL IT A FEATURE";
  fontSizeInput.value = 38;
  sizeValue.textContent = "38";
  textColorInput.value = "#ffffff";
  animationInput.value = "none";
  durationInput.value = "3";
  outlineInput.checked = true;
  uppercaseInput.checked = true;

  uploadedImage = null;
  selectedEmoji = "😂";
  selectedBackground = "#5141a8";
  imageInput.value = "";

  templates.forEach((item) => item.classList.remove("active"));
  startAnimation();
  setStatus("Editor reset.");
});

// Remove photo
document.getElementById("clearPhotoBtn").addEventListener("click", () => {
  uploadedImage = null;
  imageInput.value = "";
  startAnimation();
  setStatus("Photo removed.");
});

// Download helper
function downloadBlob(blob, filename) {
  if (!blob || !blob.size) {
    setStatus("The file is empty. Please try again.");
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// PNG export
document.getElementById("pngBtn").addEventListener("click", () => {
  try {
    redraw();

    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus("PNG export failed.");
        return;
      }

      downloadBlob(blob, "my-meme.png");
      setStatus("PNG created. Check your browser downloads.");
    }, "image/png");
  } catch (error) {
    console.error(error);
    setStatus("PNG export failed.");
  }
});

// GIF export
document.getElementById("gifBtn").addEventListener("click", () => {
  if (typeof GIF === "undefined") {
    setStatus("GIF library missing. Refresh the page and try again.");
    return;
  }

  if (isExporting) return;

  isExporting = true;
  stopAnimation();
  setStatus("Preparing GIF...");

  const duration = Math.min(5, Math.max(1, Number(durationInput.value) || 3));
  const frameCount = duration * 8;
  let completed = false;
  let timeoutId;

  function finish(message, blob) {
    if (completed) return;
    completed = true;
    clearTimeout(timeoutId);
    isExporting = false;

    if (blob && blob.size > 0) {
      downloadBlob(blob, "my-meme.gif");
      setStatus("GIF created! Check your browser downloads.");
    } else {
      setStatus(message);
    }

    startAnimation();
  }

  let gif;

  try {
    gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height,
      workerScript: "./gif.worker.js"
    });

    gif.on("progress", (progress) => {
      if (!completed) {
        setStatus("Creating GIF... " + Math.round(progress * 100) + "%");
      }
    });

    gif.on("finished", (blob) => {
      finish("GIF failed. Check that gif.worker.js exists.", blob);
    });

    for (let i = 0; i < frameCount; i++) {
      renderMeme((i * 1000) / 8);
      gif.addFrame(canvas, { copy: true, delay: 125 });
    }

    timeoutId = setTimeout(() => {
      finish("GIF timed out. Check the worker file and refresh.");
      try {
        gif.abort();
      } catch (error) {
        console.warn(error);
      }
    }, 30000);

    gif.render();
  } catch (error) {
    console.error("GIF error:", error);
    finish("GIF export failed. Check the worker file.");
  }
});

// Video export
document.getElementById("videoBtn").addEventListener("click", () => {
  if (!canvas.captureStream || !window.MediaRecorder) {
    setStatus("Video recording is not supported in this browser.");
    return;
  }

  if (isExporting) return;

  const types = [
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm"
  ];

  const mimeType = types.find((type) => MediaRecorder.isTypeSupported(type));

  if (!mimeType) {
    setStatus("This browser does not support video export.");
    return;
  }

  isExporting = true;
  stopAnimation();

  const stream = canvas.captureStream(20);
  let recorder;

  try {
    recorder = new MediaRecorder(stream, { mimeType });
  } catch (error) {
    console.error(error);
    isExporting = false;
    stream.getTracks().forEach((track) => track.stop());
    startAnimation();
    setStatus("Could not start video recording.");
    return;
  }

  const chunks = [];
  const durationMs = (Number(durationInput.value) || 3) * 1000;
  const startedAt = performance.now();

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size) chunks.push(event.data);
  };

  recorder.onerror = (event) => {
    console.error(event.error || event);
    if (recorder.state !== "inactive") recorder.stop();
  };

  recorder.onstop = () => {
    stream.getTracks().forEach((track) => track.stop());
    isExporting = false;

    if (!chunks.length) {
      setStatus("No video created. Try another browser.");
      startAnimation();
      return;
    }

    const blob = new Blob(chunks, { type: mimeType });
    const extension = mimeType.includes("mp4") ? "mp4" : "webm";
    downloadBlob(blob, "my-meme." + extension);
    setStatus("Video created in " + extension.toUpperCase() + " format.");
    startAnimation();
  };

  recorder.start(250);
  setStatus("Recording video...");

  function recordFrame(now) {
    renderMeme(now - startedAt);

    if (now - startedAt < durationMs && isExporting) {
      requestAnimationFrame(recordFrame);
    } else if (recorder.state !== "inactive") {
      recorder.stop();
    }
  }

  requestAnimationFrame(recordFrame);
});

// Initial preview
sizeValue.textContent = fontSizeInput.value;
startAnimation();
