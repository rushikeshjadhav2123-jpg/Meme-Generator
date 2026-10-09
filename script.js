/* ==========================================
   MEME GENERATOR PRO
   Photo Upload + Templates + PNG + GIF
   ========================================== */
"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("memeCanvas");
  if (!canvas) {
    console.error("Canvas not found: memeCanvas");
    return;
  }
  const ctx = canvas.getContext("2d");
  const topText = document.getElementById("topText");
  const bottomText = document.getElementById("bottomText");
  const imageInput = document.getElementById("imageInput");
  const fontSize = document.getElementById("fontSize");
  const sizeValue = document.getElementById("sizeValue");
  const textColor = document.getElementById("textColor");
  const animationSelect = document.getElementById("animation");
  const durationInput = document.getElementById("duration");
  const outline = document.getElementById("outline");
  const uppercase = document.getElementById("uppercase");
  const status = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  const clearPhotoBtn = document.getElementById("clearPhotoBtn");
  const pngBtn = document.getElementById("pngBtn");
  const gifBtn = document.getElementById("gifBtn");
  const videoBtn = document.getElementById("videoBtn");
  let uploadedImage = null;
  let animationTimer = null;
  let gifBusy = false;
  const originalWidth = 600;
  const originalHeight = 600;
  canvas.width = originalWidth;
  canvas.height = originalHeight;
  function setStatus(message) {
    if (status) status.textContent = message;
  }
  function getValue(element, fallback) {
    return element && element.value !== ""
      ? element.value
      : fallback;
  }
  function getText(element) {
    let value = element ? element.value : "";
    if (uppercase && uppercase.checked) {
      value = value.toUpperCase();
    }
    return value.trim();
  }
  function getFontSize() {
    return Math.max(
      12,
      Math.min(100, Number(getValue(fontSize, 36)) || 36)
    );
  }
  function drawPlaceholder() {
    ctx.fillStyle = "#202435";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 32px Arial";
    ctx.fillText("😂 MEME GENERATOR", canvas.width / 2, 250);
    ctx.font = "18px Arial";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Upload a photo to get started", canvas.width / 2, 300);
  }
  function drawCoverImage(image) {
    const scale = Math.max(
      canvas.width / image.width,
      canvas.height / image.height
    );
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    ctx.drawImage(image, x, y, width, height);
  }
  function wrapText(text, maxWidth, font) {
    ctx.font = font;
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    return lines;
  }
  function drawCaption(text, y, size) {
    if (!text) return;
    const padding = 22;
    const maxWidth = canvas.width - padding * 2;
    let currentSize = size;
    let font = `900 ${currentSize}px Impact, "Arial Black", sans-serif`;
    let lines = wrapText(text, maxWidth, font);
    while (
      lines.some(line => ctx.measureText(line).width > maxWidth) &&
      currentSize > 16
    ) {
      currentSize -= 2;
      font = `900 ${currentSize}px Impact, "Arial Black", sans-serif`;
      lines = wrapText(text, maxWidth, font);
    }
    const lineHeight = currentSize * 1.12;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = font;
    ctx.lineJoin = "round";
    ctx.fillStyle = textColor ? textColor.value : "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = outline && !outline.checked ? 0 : Math.max(2, currentSize / 10);
    const totalHeight = lines.length * lineHeight;
    let startY = y;
    if (y > canvas.height / 2) {
      startY = Math.min(
        y,
        canvas.height - padding - totalHeight / 2
      );
    } else {
      startY = Math.max(
        padding + totalHeight / 2,
        y
      );
    }
    lines.forEach((line, index) => {
      const lineY =
        startY + (index - (lines.length - 1) / 2) * lineHeight;
      if (ctx.lineWidth > 0) {
        ctx.strokeText(line, canvas.width / 2, lineY, maxWidth);
      }
      ctx.fillText(line, canvas.width / 2, lineY, maxWidth);
    });
  }
  function drawMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (uploadedImage) {
      drawCoverImage(uploadedImage);
    } else {
      drawPlaceholder();
    }
    const size = getFontSize();
    const top = getText(topText);
    const bottom = getText(bottomText);
    drawCaption(top, size + 22, size);
    drawCaption(bottom, canvas.height - size - 22, size);
  }
  // PHOTO UPLOAD
  if (imageInput) {
    imageInput.addEventListener("change", event => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setStatus("Please select a valid image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          uploadedImage = image;
          drawMeme();
          setStatus("Photo uploaded successfully!");
        };
        image.onerror = () => {
          setStatus("Could not load this image. Try another photo.");
        };
        image.src = reader.result;
      };
      reader.onerror = () => {
        setStatus("Failed to read the image.");
      };
      reader.readAsDataURL(file);
    });
  }
  // LIVE TEXT AND STYLE UPDATES
  [
    topText,
    bottomText,
    fontSize,
    textColor,
    outline,
    uppercase
  ].forEach(element => {
    if (!element) return;
    element.addEventListener("input", () => {
      if (sizeValue && element === fontSize) {
        sizeValue.textContent = fontSize.value;
      }
      drawMeme();
    });
    element.addEventListener("change", drawMeme);
  });
  // TEMPLATE BUTTONS
  document.querySelectorAll(".template").forEach(button => {
    button.addEventListener("click", () => {
      const top = button.dataset.top || button.dataset.topText || "";
      const bottom = button.dataset.bottom || button.dataset.bottomText || "";
      if (topText) topText.value = top;
      if (bottomText) bottomText.value = bottom;
      drawMeme();
      setStatus("Template applied!");
    });
  });
  // CLEAR PHOTO
  if (clearPhotoBtn) {
    clearPhotoBtn.addEventListener("click", () => {
      uploadedImage = null;
      if (imageInput) imageInput.value = "";
      drawMeme();
      setStatus("Photo cleared.");
    });
  }
  // RESET EDITOR
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (topText) topText.value = "";
      if (bottomText) bottomText.value = "";
      if (fontSize) fontSize.value = "36";
      if (sizeValue) sizeValue.textContent = "36";
      if (textColor) textColor.value = "#ffffff";
      if (outline) outline.checked = false;
      if (uppercase) uppercase.checked = false;
      uploadedImage = null;
      if (imageInput) imageInput.value = "";
      drawMeme();
      setStatus("Editor reset.");
    });
  }
  // DOWNLOAD PNG
  if (pngBtn) {
    pngBtn.addEventListener("click", () => {
      try {
        drawMeme();
        const link = document.createElement("a");
        link.download = "my-meme.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        setStatus("PNG download started.");
      } catch (error) {
        console.error(error);
        setStatus("PNG export failed.");
      }
    });
  }
  // GET GIF LIBRARY
  function getGIFConstructor() {
    if (typeof window.GIF === "function") {
      return window.GIF;
    }
    return null;
  }
  // DOWNLOAD ANIMATED GIF
  async function downloadGIF() {
    if (gifBusy) return;
    const GIFConstructor = getGIFConstructor();
    if (!GIFConstructor) {
      setStatus("GIF library missing. Check the GIF script in index.html.");
      return;
    }
    gifBusy = true;
    if (gifBtn) gifBtn.disabled = true;
    setStatus("Creating GIF... please wait.");
    let gif = null;
    let timeoutId = null;
    try {
      const frames = 12;
      const delay = 150;
      // The worker file must exist in the repository root.
      gif = new GIFConstructor({
        workers: 2,
        quality: 12,
        width: canvas.width,
        height: canvas.height,
        workerScript: "./gif.worker.js"
      });
      const originalTop = getText(topText);
      const originalBottom = getText(bottomText);
      const effect = getValue(animationSelect, "bounce");
      for (let i = 0; i < frames; i++) {
        drawMeme();
        if (effect === "bounce") {
          const offset = Math.sin((i / frames) * Math.PI * 2) * 12;
          const size = getFontSize();
          drawCaption(originalTop, size + 22 + offset, size);
          drawCaption(
            originalBottom,
            canvas.height - size - 22 - offset,
            size
          );
        } else if (effect === "pulse") {
          const pulse = Math.sin((i / frames) * Math.PI * 2) * 4;
          const size = getFontSize() + pulse;
          drawCaption(originalTop, size + 22, size);
          drawCaption(originalBottom, canvas.height - size - 22, size);
        } else if (effect === "shake") {
          const offset = (i % 2 === 0 ? -5 : 5);
          const size = getFontSize();
          ctx.save();
          ctx.translate(offset, 0);
          // Redraw this frame shifted horizontally.
          ctx.clearRect(-offset, 0, canvas.width, canvas.height);
          if (uploadedImage) {
            drawCoverImage(uploadedImage);
          } else {
            drawPlaceholder();
          }
          drawCaption(originalTop, size + 22, size);
          drawCaption(
            originalBottom,
            canvas.height - size - 22,
            size
          );
          ctx.restore();
        }
        gif.addFrame(canvas, {
          copy: true,
          delay
        });
      }
      // Stop waiting if a worker fails to respond.
      timeoutId = setTimeout(() => {
        if (gifBusy) {
          try {
            gif.abort();
          } catch (_) {}
          setStatus(
            "GIF timed out. Check gif.worker.js and refresh the page."
          );
          gifBusy = false;
          if (gifBtn) gifBtn.disabled = false;
        }
      }, 30000);
      gif.on("finished", blob => {
        clearTimeout(timeoutId);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "my-animated-meme.gif";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        setStatus("GIF created successfully!");
        gifBusy = false;
        if (gifBtn) gifBtn.disabled = false;
      });
      gif.on("abort", () => {
        clearTimeout(timeoutId);
        setStatus("GIF creation cancelled.");
        gifBusy = false;
        if (gifBtn) gifBtn.disabled = false;
      });
      gif.on("error", error => {
        clearTimeout(timeoutId);
        console.error("GIF error:", error);
        setStatus("GIF failed. Check the worker file and browser console.");
        gifBusy = false;
        if (gifBtn) gifBtn.disabled = false;
      });
      gif.render();
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error("GIF generation error:", error);
      if (gif) {
        try {
          gif.abort();
        } catch (_) {}
      }
      setStatus("GIF creation failed. Verify gif.worker.js is committed.");
      gifBusy = false;
      if (gifBtn) gifBtn.disabled = false;
    }
  }
  if (gifBtn) {
    gifBtn.addEventListener("click", downloadGIF);
  }
  // VIDEO BUTTON: export supported by browser MediaRecorder
  if (videoBtn) {
    videoBtn.addEventListener("click", () => {
      if (!canvas.captureStream || !window.MediaRecorder) {
        setStatus("Video recording is not supported in this browser.");
        return;
      }
      try {
        const stream = canvas.captureStream(10);
        const options = {};
        if (MediaRecorder.isTypeSupported("video/webm")) {
          options.mimeType = "video/webm";
        }
        const recorder = new MediaRecorder(stream, options);
        const chunks = [];
        recorder.ondataavailable = event => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(chunks, {
            type: recorder.mimeType || "video/webm"
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "my-meme.webm";
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 10000);
          stream.getTracks().forEach(track => track.stop());
          setStatus("Video export finished.");
        };
        let frame = 0;
        const maxFrames = 30;
        recorder.start();
        animationTimer = setInterval(() => {
          drawMeme();
          if (frame % 2 === 0) {
            const size = getFontSize();
            const shift = Math.sin(frame / 3) * 8;
            drawCaption(
              getText(topText),
              size + 22 + shift,
              size
            );
            drawCaption(
              getText(bottomText),
              canvas.height - size - 22 - shift,
              size
            );
          }
          frame++;
          if (frame >= maxFrames) {
            clearInterval(animationTimer);
            animationTimer = null;
            recorder.stop();
          }
        }, 100);
        setStatus("Recording meme video...");
      } catch (error) {
        console.error(error);
        setStatus("Video export failed in this browser.");
      }
    });
  }
  drawMeme();
  setStatus("Ready! Upload a photo or choose a template.");
});
