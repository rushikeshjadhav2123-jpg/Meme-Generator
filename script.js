/* ==========================================
   MEME GENERATOR PRO
   Photo Upload + Templates + PNG + GIF + Video
   GIF worker CDN fix
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
  let gifBusy = false;
  let videoTimer = null;
  const WIDTH = 600;
  const HEIGHT = 600;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
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
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 32px Arial";
    ctx.fillText("😂 MEME GENERATOR", WIDTH / 2, 250);
    ctx.font = "18px Arial";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Upload a photo to get started", WIDTH / 2, 300);
  }
  function drawCoverImage(image) {
    const scale = Math.max(
      WIDTH / image.width,
      HEIGHT / image.height
    );
    const width = image.width * scale;
    const height = image.height * scale;
    ctx.drawImage(
      image,
      (WIDTH - width) / 2,
      (HEIGHT - height) / 2,
      width,
      height
    );
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
    const maxWidth = WIDTH - padding * 2;
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
    const totalHeight = lines.length * lineHeight;
    let startY = y;
    if (y > HEIGHT / 2) {
      startY = Math.min(y, HEIGHT - padding - totalHeight / 2);
    } else {
      startY = Math.max(padding + totalHeight / 2, y);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = font;
    ctx.lineJoin = "round";
    ctx.fillStyle = textColor ? textColor.value : "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth =
      outline && !outline.checked
        ? 0
        : Math.max(2, currentSize / 10);
    lines.forEach((line, index) => {
      const lineY =
        startY + (index - (lines.length - 1) / 2) * lineHeight;
      if (ctx.lineWidth > 0) {
        ctx.strokeText(line, WIDTH / 2, lineY, maxWidth);
      }
      ctx.fillText(line, WIDTH / 2, lineY, maxWidth);
    });
  }
  function drawMeme() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (uploadedImage) {
      drawCoverImage(uploadedImage);
    } else {
      drawPlaceholder();
    }
    const size = getFontSize();
    drawCaption(getText(topText), size + 22, size);
    drawCaption(getText(bottomText), HEIGHT - size - 22, size);
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
  // LIVE EDITOR UPDATES
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
  // TEMPLATES
  document.querySelectorAll(".template").forEach(button => {
    button.addEventListener("click", () => {
      if (topText) {
        topText.value =
          button.dataset.top || button.dataset.topText || "";
      }
      if (bottomText) {
        bottomText.value =
          button.dataset.bottom || button.dataset.bottomText || "";
      }
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
  // RESET
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
  // SHARED DOWNLOAD HELPER
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  // DOWNLOAD PNG
  if (pngBtn) {
    pngBtn.addEventListener("click", () => {
      try {
        drawMeme();
        canvas.toBlob(blob => {
          if (!blob) {
            setStatus("PNG export failed.");
            return;
          }
          downloadBlob(blob, "my-meme.png");
          setStatus("PNG download started.");
        }, "image/png");
      } catch (error) {
        console.error("PNG error:", error);
        setStatus("PNG export failed.");
      }
    });
  }
  // GIF LIBRARY
  function getGIFConstructor() {
    return typeof window.GIF === "function"
      ? window.GIF
      : null;
  }
  // DOWNLOAD ANIMATED GIF
  async function downloadGIF() {
    if (gifBusy) return;
    const GIFConstructor = getGIFConstructor();
    if (!GIFConstructor) {
      setStatus("GIF library missing. Check gif.js in index.html.");
      return;
    }
    gifBusy = true;
    if (gifBtn) gifBtn.disabled = true;
    setStatus("Creating GIF... please wait.");
    let gif = null;
    let timeoutId = null;
    let completed = false;
    function finish(message) {
      if (completed) return;
      completed = true;
      if (timeoutId) clearTimeout(timeoutId);
      gifBusy = false;
      if (gifBtn) gifBtn.disabled = false;
      setStatus(message);
    }
    try {
      const frames = 12;
      const delay = 150;
      gif = new GIFConstructor({
        workers: 2,
        quality: 10,
        width: WIDTH,
        height: HEIGHT,
        workerScript:
          "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js"
      });
      const effect = getValue(animationSelect, "bounce");
      for (let i = 0; i < frames; i++) {
        drawMeme();
        const size = getFontSize();
        const top = getText(topText);
        const bottom = getText(bottomText);
        if (effect === "bounce") {
          const offset =
            Math.sin((i / frames) * Math.PI * 2) * 12;
          drawCaption(top, size + 22 + offset, size);
          drawCaption(bottom, HEIGHT - size - 22 - offset, size);
        } else if (effect === "pulse") {
          const pulse =
            Math.sin((i / frames) * Math.PI * 2) * 4;
          const newSize = size + pulse;
          drawCaption(top, newSize + 22, newSize);
          drawCaption(bottom, HEIGHT - newSize - 22, newSize);
        } else if (effect === "shake") {
          const offset = i % 2 === 0 ? -5 : 5;
          ctx.save();
          ctx.translate(offset, 0);
          // Redraw the entire frame at the shifted position.
          ctx.fillStyle = "#202435";
          ctx.fillRect(-offset, 0, WIDTH, HEIGHT);
          if (uploadedImage) {
            drawCoverImage(uploadedImage);
          } else {
            drawPlaceholder();
          }
          drawCaption(top, size + 22, size);
          drawCaption(bottom, HEIGHT - size - 22, size);
          ctx.restore();
        }
        gif.addFrame(canvas, {
          copy: true,
          delay
        });
      }
      gif.on("finished", blob => {
        if (!blob || blob.size === 0) {
          finish("GIF failed: empty file generated.");
          return;
        }
        downloadBlob(blob, "my-animated-meme.gif");
        finish("GIF created! If it did not save, open the download link in your browser.");
      });
      gif.on("abort", () => {
        finish("GIF creation cancelled.");
      });
      gif.on("error", error => {
        console.error("GIF render error:", error);
        finish("GIF failed. Check internet connection and gif.js worker.");
      });
      timeoutId = setTimeout(() => {
        if (completed) return;
        try {
          gif.abort();
        } catch (error) {
          console.warn("Could not abort GIF:", error);
        }
        finish("GIF timed out. Refresh the page and try again.");
      }, 60000);
      gif.render();
    } catch (error) {
      console.error("GIF generation error:", error);
      if (gif) {
        try {
          gif.abort();
        } catch (_) {}
      }
      finish("GIF creation failed. Check gif.js and worker loading.");
    }
  }
  if (gifBtn) {
    gifBtn.addEventListener("click", downloadGIF);
  }
  // VIDEO EXPORT (WEBM)
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
        recorder.onerror = event => {
          console.error("Video recording error:", event);
          setStatus("Video recording failed.");
        };
        recorder.onstop = () => {
          const blob = new Blob(chunks, {
            type: recorder.mimeType || "video/webm"
          });
          downloadBlob(blob, "my-meme.webm");
          stream.getTracks().forEach(track => track.stop());
          setStatus("Video export finished.");
        };
        let frame = 0;
        const maxFrames = 30;
        recorder.start();
        if (videoTimer) clearInterval(videoTimer);
        videoTimer = setInterval(() => {
          drawMeme();
          const size = getFontSize();
          const shift = Math.sin(frame / 3) * 8;
          drawCaption(
            getText(topText),
            size + 22 + shift,
            size
          );
          drawCaption(
            getText(bottomText),
            HEIGHT - size - 22 - shift,
            size
          );
          frame++;
          if (frame >= maxFrames) {
            clearInterval(videoTimer);
            videoTimer = null;
            recorder.stop();
          }
        }, 100);
        setStatus("Recording meme video...");
      } catch (error) {
        console.error("Video export error:", error);
        setStatus("Video export failed in this browser.");
      }
    });
  }
  drawMeme();
  setStatus("Ready! Upload a photo or choose a template.");
});
