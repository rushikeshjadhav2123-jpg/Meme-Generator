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
let uploadedImage = null;
let selectedEmoji = "😂";
let selectedBackground = null;
let animationFrame = null;
let recording = false;
const templates = document.querySelectorAll(".template");
function setStatus(message) {
  statusBox.textContent = message;
}
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, selectedBackground || "#5141a8");
  gradient.addColorStop(1, "#171d39");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (uploadedImage) {
    const iw = uploadedImage.width;
    const ih = uploadedImage.height;
    const scale = Math.max(canvas.width / iw, canvas.height / ih);
    const w = iw * scale;
    const h = ih * scale;
    ctx.drawImage(
      uploadedImage,
      (canvas.width - w) / 2,
      (canvas.height - h) / 2,
      w,
      h
    );
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "180px Arial";
    ctx.fillText(selectedEmoji, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(90, 90, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(710, 500, 100, 0, Math.PI * 2);
    ctx.fill();
  }
}
function wrapText(text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
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
  return lines;
}
function drawCaption(text, y, fontSize, pulseScale = 1) {
  if (!text.trim()) return;
  const output = uppercaseInput.checked ? text.toUpperCase() : text;
  const size = fontSize * pulseScale;
  ctx.save();
  ctx.font = `900 ${size}px Impact, "Arial Black", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColorInput.value;
  ctx.lineJoin = "round";
  const lines = wrapText(output, canvas.width * 0.88);
  const lineHeight = size * 1.12;
  lines.forEach((line, index) => {
    const lineY = y + (index - (lines.length - 1) / 2) * lineHeight;
    if (outlineInput.checked) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(3, size * 0.12);
      ctx.strokeText(line, canvas.width / 2, lineY, canvas.width * 0.9);
    }
    ctx.fillText(line, canvas.width / 2, lineY, canvas.width * 0.9);
  });
  ctx.restore();
}
function renderMeme(time = 0) {
  drawBackground();
  let pulseScale = 1;
  let topY = 65;
  let bottomY = canvas.height - 65;
  if (animationInput.value === "bounce") {
    topY += Math.sin(time / 180) * 12;
    bottomY -= Math.sin(time / 180) * 12;
  } else if (animationInput.value === "pulse") {
    pulseScale = 1 + Math.sin(time / 180) * 0.08;
  }
  const fontSize = Number(fontSizeInput.value);
  drawCaption(topInput.value, topY, fontSize, pulseScale);
  drawCaption(bottomInput.value, bottomY, fontSize, pulseScale);
}
function redraw() {
  renderMeme(performance.now());
}
function startAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  function animate(time) {
    renderMeme(time);
    if (animationInput.value !== "none") {
      animationFrame = requestAnimationFrame(animate);
    }
  }
  animate(performance.now());
}
templates.forEach((button) => {
  button.addEventListener("click", () => {
    templates.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedEmoji = button.dataset.emoji || "😂";
    selectedBackground = button.dataset.bg || null;
    topInput.value = button.dataset.top || "";
    bottomInput.value = button.dataset.bottom || "";
    uploadedImage = null;
    imageInput.value = "";
    startAnimation();
    setStatus("Template selected. Customize your captions!");
  });
});
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus("Please choose a valid image file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      uploadedImage = image;
      startAnimation();
      setStatus("Photo uploaded successfully!");
    };
    image.onerror = () => setStatus("Could not load that image.");
    image.src = reader.result;
  };
  reader.onerror = () => setStatus("Could not read that file.");
  reader.readAsDataURL(file);
});
[
  topInput,
  bottomInput,
  textColorInput,
  animationInput,
  outlineInput,
  uppercaseInput
].forEach((element) => {
  element.addEventListener("input", startAnimation);
  element.addEventListener("change", startAnimation);
});
fontSizeInput.addEventListener("input", () => {
  sizeValue.textContent = fontSizeInput.value;
  startAnimation();
});
document.getElementById("resetBtn").addEventListener("click", () => {
  topInput.value = "WHEN LIFE GIVES YOU BUGS";
  bottomInput.value = "CALL IT A FEATURE";
  fontSizeInput.value = 38;
  sizeValue.textContent = "38";
  textColorInput.value = "#ffffff";
  animationInput.value = "none";
  outlineInput.checked = true;
  uppercaseInput.checked = true;
  uploadedImage = null;
  selectedEmoji = "😂";
  selectedBackground = null;
  imageInput.value = "";
  templates.forEach((item) => item.classList.remove("active"));
  startAnimation();
  setStatus("Meme editor reset.");
});
document.getElementById("clearPhotoBtn").addEventListener("click", () => {
  uploadedImage = null;
  imageInput.value = "";
  startAnimation();
  setStatus("Photo removed.");
});
document.getElementById("pngBtn").addEventListener("click", () => {
  redraw();
  canvas.toBlob((blob) => {
    if (!blob) {
      setStatus("PNG export failed. Please try again.");
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-meme.png";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("PNG download started.");
  }, "image/png");
});
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
document.getElementById("gifBtn").addEventListener("click", async () => {
  if (typeof GIF === "undefined") {
    setStatus("GIF library unavailable. Check your internet connection.");
    return;
  }
  setStatus("Creating GIF... please wait.");
  try {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height,
      workerScript:
        "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js"
    });
    const duration = Number(durationInput.value);
    const frames = duration * 10;
    for (let i = 0; i < frames; i++) {
      renderMeme(i * 100);
      gif.addFrame(canvas, { copy: true, delay: 100 });
    }
    gif.on("finished", (blob) => {
      downloadBlob(blob, "my-meme.gif");
      setStatus("GIF download started.");
    });
    gif.on("abort", () => setStatus("GIF export was cancelled."));
    gif.render();
  } catch (error) {
    console.error(error);
    setStatus("GIF export failed. Try PNG or video instead.");
  }
});
document.getElementById("videoBtn").addEventListener("click", () => {
  if (!canvas.captureStream || !window.MediaRecorder) {
    setStatus("Video export is not supported in this browser. Try Chrome on a computer or download PNG.");
    return;
  }
  if (recording) return;
  recording = true;
  const stream = canvas.captureStream(20);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  let recorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType });
  } catch (error) {
    recording = false;
    stream.getTracks().forEach((track) => track.stop());
    setStatus("This browser cannot record the video format.");
    return;
  }
  const chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size) chunks.push(event.data);
  };
  recorder.onerror = () => {
    recording = false;
    stream.getTracks().forEach((track) => track.stop());
    setStatus("Video export failed.");
  };
  recorder.onstop = () => {
    recording = false;
    stream.getTracks().forEach((track) => track.stop());
    if (!chunks.length) {
      setStatus("No video was created. Try another browser.");
      return;
    }
    const blob = new Blob(chunks, { type: mimeType });
    downloadBlob(blob, "my-meme.webm");
    setStatus("Video download started.");
  };
  const duration = Number(durationInput.value) * 1000;
  const startTime = performance.now();
  function recordFrame(now) {
    renderMeme(now - startTime);
    if (now - startTime < duration && recording) {
      requestAnimationFrame(recordFrame);
    } else if (recording && recorder.state !== "inactive") {
      recorder.stop();
    }
  }
  recorder.start();
  setStatus("Recording meme video...");
  requestAnimationFrame(recordFrame);
});
startAnimation();
