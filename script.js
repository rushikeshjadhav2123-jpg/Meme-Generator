
/* ==========================================
   MEME GENERATOR PRO
   Photo Upload + Templates + PNG + GIF + Video
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("memeCanvas");
  if (!canvas) {
    console.error("Canvas #memeCanvas not found.");
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

  const WIDTH = 600;
  const HEIGHT = 600;
  const FPS = 10;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  let uploadedImage = null;
  let gifBusy = false;
  let videoBusy = false;
  let videoTimer = null;

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

  function getDuration() {
    return Math.max(
      1,
      Math.min(10, Number(getValue(durationInput, 3)) || 3)
    );
  }

  // Draw empty canvas
  function drawPlaceholder() {
    ctx.fillStyle = "#202435";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.fillText("MEME GENERATOR", WIDTH / 2, 250);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "18px Arial";
    ctx.fillText(
      "Upload a photo to get started",
      WIDTH / 2,
      300
    );
  }

  // Draw image without distortion
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

  // Wrap long captions
  function wrapText(text, maxWidth, font) {
    ctx.font = font;

    const words = text.split(/\s+/);
    const lines = [];
    let line = "";

    for (const word of words) {
      const testLine = line ? line + " " + word : word;

      if (
        ctx.measureText(testLine).width > maxWidth &&
        line
      ) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) lines.push(line);

    return lines;
  }

  // Draw caption
  function drawCaption(text, y, size, xOffset = 0) {
    if (!text) return;

    const padding = 24;
    const maxWidth = WIDTH - padding * 2;

    let currentSize = size;
    let font =
      `900 ${currentSize}px Impact, "Arial Black", sans-serif`;

    let lines = wrapText(text, maxWidth, font);

    while (
      lines.some(
        line => ctx.measureText(line).width > maxWidth
      ) &&
      currentSize > 16
    ) {
      currentSize -= 2;
      font =
        `900 ${currentSize}px Impact, "Arial Black", sans-serif`;
      lines = wrapText(text, maxWidth, font);
    }

    const lineHeight = currentSize * 1.12;
    const totalHeight = lines.length * lineHeight;

    let startY;

    if (y > HEIGHT / 2) {
      startY = Math.min(
        y,
        HEIGHT - padding - totalHeight / 2
      );
    } else {
      startY = Math.max(
        padding + totalHeight / 2,
        y
      );
    }

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = font;
    ctx.lineJoin = "round";
    ctx.fillStyle = textColor
      ? textColor.value
      : "#ffffff";

    ctx.strokeStyle = "#000000";

    const showOutline = !outline || outline.checked;
    ctx.lineWidth = showOutline
      ? Math.max(2, currentSize / 10)
      : 0;

    lines.forEach((line, index) => {
      const lineY =
        startY +
        (index - (lines.length - 1) / 2) * lineHeight;

      const x = WIDTH / 2 + xOffset;

      if (showOutline) {
        ctx.strokeText(line, x, lineY, maxWidth);
      }

      ctx.fillText(line, x, lineY, maxWidth);
    });

    ctx.restore();
  }

  // Draw one complete frame
  function drawFrame(frameNumber = 0, totalFrames = 1) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (uploadedImage) {
      drawCoverImage(uploadedImage);
    } else {
      drawPlaceholder();
    }

    const size = getFontSize();
    const top = getText(topText);
    const bottom = getText(bottomText);
    const effect = getValue(animationSelect, "none");

    let topY = size + 22;
    let bottomY = HEIGHT - size - 22;
    let captionSize = size;
    let xOffset = 0;

    const angle =
      totalFrames > 1
        ? (frameNumber / totalFrames) * Math.PI * 2
        : 0;

    if (effect === "bounce") {
      const offset = Math.sin(angle) * 12;
      topY += offset;
      bottomY -= offset;
    } else if (effect === "pulse") {
      captionSize = size + Math.sin(angle) * 4;
      topY = captionSize + 22;
      bottomY = HEIGHT - captionSize - 22;
    } else if (effect === "shake") {
      xOffset = frameNumber % 2 === 0 ? -5 : 5;
    }

    drawCaption(top, topY, captionSize, xOffset);
    drawCaption(bottom, bottomY, captionSize, xOffset);
  }

  function drawMeme() {
    drawFrame();
  }

  // Photo upload
  if (imageInput) {
    imageInput.addEventListener("change", event => {
      const file = event.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setStatus("Please select a valid image.");
        imageInput.value = "";
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
          setStatus("Could not load this image. Try another.");
        };

        image.src = reader.result;
      };

      reader.onerror = () => {
        setStatus("Failed to read the image.");
      };

      reader.readAsDataURL(file);
    });
  }

  // Live editor
  [
    topText,
    bottomText,
    fontSize,
    textColor,
    outline,
    uppercase,
    animationSelect
  ].forEach(element => {
    if (!element) return;

    element.addEventListener("input", () => {
      if (element === fontSize && sizeValue) {
        sizeValue.textContent = fontSize.value;
      }

      drawMeme();
    });

    element.addEventListener("change", drawMeme);
  });

  // Templates
  document.querySelectorAll(".template").forEach(button => {
    button.addEventListener("click", () => {
      if (topText) {
        topText.value =
          button.dataset.top ||
          button.dataset.topText ||
          "";
      }

      if (bottomText) {
        bottomText.value =
          button.dataset.bottom ||
          button.dataset.bottomText ||
          "";
      }

      drawMeme();
      setStatus("Template applied!");
    });
  });

  // Clear photo
  if (clearPhotoBtn) {
    clearPhotoBtn.addEventListener("click", () => {
      uploadedImage = null;

      if (imageInput) imageInput.value = "";

      drawMeme();
      setStatus("Photo cleared.");
    });
  }

  // Reset editor
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (topText) topText.value = "";
      if (bottomText) bottomText.value = "";

      if (fontSize) fontSize.value = "36";
      if (sizeValue) sizeValue.textContent = "36";
      if (textColor) textColor.value = "#ffffff";
      if (outline) outline.checked = false;
      if (uppercase) uppercase.checked = false;
      if (animationSelect) animationSelect.value = "none";
      if (durationInput) durationInput.value = "3";

      uploadedImage = null;

      if (imageInput) imageInput.value = "";

      drawMeme();
      setStatus("Editor reset.");
    });
  }

  // Download blob
  function downloadBlob(blob, filename) {
    if (!blob || blob.size === 0) {
      throw new Error("The exported file is empty.");
    }

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

  // PNG download
  if (pngBtn) {
    pngBtn.addEventListener("click", () => {
      try {
        drawMeme();

        canvas.toBlob(blob => {
          try {
            downloadBlob(blob, "my-meme.png");
            setStatus("PNG download started!");
          } catch (error) {
            console.error("PNG export error:", error);
            setStatus("PNG export failed.");
          }
        }, "image/png");
      } catch (error) {
        console.error("PNG export error:", error);
        setStatus("PNG export failed.");
      }
    });
  }

  // GIF library
  function getGIFConstructor() {
    return typeof window.GIF === "function"
      ? window.GIF
      : null;
  }

  // GIF download
  async function downloadGIF() {
    if (gifBusy || videoBusy) return;

    const GIFConstructor = getGIFConstructor();

    if (!GIFConstructor) {
      setStatus("GIF library missing. Check gif.js in index.html.");
      return;
    }

    gifBusy = true;

    if (gifBtn) gifBtn.disabled = true;
    if (pngBtn) pngBtn.disabled = true;
    if (videoBtn) videoBtn.disabled = true;

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
      if (pngBtn) pngBtn.disabled = false;
      if (videoBtn) videoBtn.disabled = false;

      setStatus(message);
    }

    try {
      const delay = 100;
      const totalFrames = Math.round(getDuration() * FPS);

      gif = new GIFConstructor({
        workers: 2,
        quality: 10,
        width: WIDTH,
        height: HEIGHT,
        workerScript: "./gif.worker.js"
      });

      for (let i = 0; i < totalFrames; i++) {
        drawFrame(i, totalFrames);

        gif.addFrame(canvas, {
          copy: true,
          delay
        });
      }

      gif.on("finished", blob => {
        try {
          downloadBlob(blob, "my-animated-meme.gif");
          finish("GIF created successfully!");
        } catch (error) {
          console.error("GIF download error:", error);
          finish("GIF created but download failed.");
        }
      });

      gif.on("abort", () => {
        finish("GIF creation cancelled.");
      });

      timeoutId = setTimeout(() => {
        if (completed) return;

        try {
          gif.abort();
        } catch (error) {
          console.warn("GIF abort error:", error);
        }

        finish("GIF timed out. Check gif.worker.js and try again.");
      }, 90000);

      gif.render();
    } catch (error) {
      console.error("GIF generation error:", error);

      if (gif) {
        try {
          gif.abort();
        } catch (_) {}
      }

      finish("GIF failed. Check gif.js and gif.worker.js.");
    }
  }

  if (gifBtn) {
    gifBtn.addEventListener("click", downloadGIF);
  }

  // WebM video download
  if (videoBtn) {
    videoBtn.addEventListener("click", () => {
      if (gifBusy || videoBusy) return;

      if (
        !canvas.captureStream ||
        typeof window.MediaRecorder === "undefined"
      ) {
        setStatus("Video export is not supported in this browser.");
        return;
      }

      let stream = null;
      let recorder = null;
      let stopped = false;

      try {
        videoBusy = true;

        videoBtn.disabled = true;
        if (gifBtn) gifBtn.disabled = true;
        if (pngBtn) pngBtn.disabled = true;

        const duration = getDuration();
        const totalFrames = FPS * duration;
        let frame = 0;

        stream = canvas.captureStream(FPS);

        const options = {};

        if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
          options.mimeType = "video/webm;codecs=vp9";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
          options.mimeType = "video/webm";
        }

        recorder = new MediaRecorder(stream, options);
        const chunks = [];

        function cleanupVideo() {
          if (stopped) return;
          stopped = true;

          if (videoTimer) {
            clearInterval(videoTimer);
            videoTimer = null;
          }

          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }

          videoBusy = false;
          videoBtn.disabled = false;

          if (gifBtn) gifBtn.disabled = false;
          if (pngBtn) pngBtn.disabled = false;
        }

        recorder.ondataavailable = event => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onerror = event => {
          console.error("Video recording error:", event);
          cleanupVideo();
          setStatus("Video recording failed.");
        };

        recorder.onstop = () => {
          try {
            const blob = new Blob(chunks, {
              type: recorder.mimeType || "video/webm"
            });

            downloadBlob(blob, "my-meme-video.webm");
            setStatus("Video downloaded successfully!");
          } catch (error) {
            console.error("Video download error:", error);
            setStatus("Could not download the video.");
          } finally {
            cleanupVideo();
          }
        };

        drawFrame(0, totalFrames);
        recorder.start();

        videoTimer = setInterval(() => {
          drawFrame(frame, totalFrames);
          frame++;

          if (frame >= totalFrames) {
            clearInterval(videoTimer);
            videoTimer = null;

            if (recorder.state !== "inactive") {
              recorder.stop();
            }
          }
        }, 1000 / FPS);

        setStatus("Recording video... please wait.");
      } catch (error) {
        console.error("Video export error:", error);

        if (videoTimer) {
          clearInterval(videoTimer);
          videoTimer = null;
        }

        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        videoBusy = false;
        videoBtn.disabled = false;

        if (gifBtn) gifBtn.disabled = false;
        if (pngBtn) pngBtn.disabled = false;

        setStatus("Video export failed in this browser.");
      }
    });
  }

  // Initial canvas
  drawMeme();
  setStatus("Ready! Upload a photo or choose a template.");
});
