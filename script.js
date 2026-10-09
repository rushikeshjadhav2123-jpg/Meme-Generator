"use strict";

const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");

const topInput = document.getElementById("topText");
const bottomInput = document.getElementById("bottomText");
const sizeInput = document.getElementById("fontSize");
const colorInput = document.getElementById("textColor");
const outlineInput = document.getElementById("outline");
const uppercaseInput = document.getElementById("uppercase");
const animationInput = document.getElementById("animation");
const durationInput = document.getElementById("duration");

const templateGrid = document.getElementById("templateGrid");
const statusEl = document.getElementById("status");
const sizeLabel = document.getElementById("fontSizeValue");
const currentTemplate = document.getElementById("currentTemplate");

const templates = [
  {
    name: "Question Paper",
    emoji: "😳",
    top: "OPENING QUESTION PAPER",
    bottom: "YE KYA HAI BHAI?!",
    c1: "#f6a34a",
    c2: "#aa315a"
  },
  {
    name: "Attendance",
    emoji: "🥲",
    top: "ATTENDANCE 70% CHAHIYE",
    bottom: "SIR MAIN REGULAR HOON",
    c1: "#ffb56b",
    c2: "#a74d75"
  },
  {
    name: "Notes Please",
    emoji: "🙏",
    top: "BHAI NOTES BHEJ NA",
    bottom: "BHAI MAIN BHI DHUND RAHA HOON",
    c1: "#66d5d0",
    c2: "#5a65bb"
  },
  {
    name: "Night Before Exam",
    emoji: "🥴",
    top: "EXAM KAL HAI",
    bottom: "SYLLABUS AAJ HI DEKHA",
    c1: "#313e77",
    c2: "#11182f"
  },
  {
    name: "Canteen",
    emoji: "🍜",
    top: "LECTURE IMPORTANT HAI",
    bottom: "PAR VADA PAV BHI IMPORTANT HAI",
    c1: "#ffb548",
    c2: "#e65f4d"
  },
  {
    name: "Assignment",
    emoji: "💻",
    top: "TEACHER: SUBMIT TODAY",
    bottom: "SIR FILE CORRUPT HO GAYI",
    c1: "#55b7df",
    c2: "#6654ac"
  },
  {
    name: "Backbencher",
    emoji: "😎",
    top: "TEACHER ASKING QUESTION",
    bottom: "SIR NETWORK ISSUE",
    c1: "#f6cb66",
    c2: "#eb6d9b"
  },
  {
    name: "Group Project",
    emoji: "🤡",
    top: "GROUP PROJECT",
    bottom: "KAAM EK BANDE NE KIYA",
    c1: "#8bdb91",
    c2: "#2f8f88"
  },
  {
    name: "Result Day",
    emoji: "🫣",
    top: "RESULT IS OUT",
    bottom: "PARENTS KO PHONE MAT DENA",
    c1: "#fa8e82",
    c2: "#9c3e69"
  },
  {
    name: "Proxy Attendance",
    emoji: "🗣️",
    top: "BHAI MERI PROXY LAGA",
    bottom: "PRESENT SIR, DONO KI",
    c1: "#a99cff",
    c2: "#4c65b9"
  },
  {
    name: "Placement",
    emoji: "🧑‍💻",
    top: "PLACEMENT READY",
    bottom: "RESUME MEIN SKILLS KYA LIKHU?",
    c1: "#5ce1bd",
    c2: "#4268a8"
  },
  {
    name: "Last Day",
    emoji: "🥹",
    top: "LAST DAY OF COLLEGE",
    bottom: "AB BAKCHODI KISKE SAATH?",
    c1: "#ffc56d",
    c2: "#ef719d"
  }
];

let selected = 0;
let startTime = performance.now();
let exportBusy = false;

// Status message
function setStatus(message, error = false) {
  statusEl.textContent = message;
  statusEl.style.color = error ? "#ff9cae" : "#83e7c0";
}

// Draw rounded rectangle
function roundRect(x, y, w, h, radius, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

// Create template buttons
function buildTemplates() {
  templateGrid.innerHTML = "";

  templates.forEach((template, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "template-card";

    button.innerHTML = `
      <div class="template-art"
        style="--c1:${template.c1};--c2:${template.c2}">
        ${template.emoji}
      </div>
      <span class="template-name"></span>
    `;

    button.querySelector(".template-name").textContent =
      template.name;

    button.addEventListener("click", () => {
      selectTemplate(index);
    });

    templateGrid.appendChild(button);
  });
}

// Select template
function selectTemplate(index) {
  selected = index;

  const template = templates[index];

  topInput.value = template.top;
  bottomInput.value = template.bottom;

  currentTemplate.textContent =
    "Template: " + template.name;

  [...templateGrid.children].forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });

  startTime = performance.now();

  drawMeme(0);

  setStatus("Selected " + template.name + ". Edit your captions!");
}

// Get editor settings
function getSettings() {
  return {
    top: uppercaseInput.checked
      ? topInput.value.toUpperCase()
      : topInput.value,

    bottom: uppercaseInput.checked
      ? bottomInput.value.toUpperCase()
      : bottomInput.value,

    size: Number(sizeInput.value),
    color: colorInput.value,
    outline: outlineInput.checked,
    animation: animationInput.value
  };
}

// Wrap caption text
function wrapText(text, maxWidth, font) {
  ctx.font = font;

  const words = text.trim().split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach(word => {
    const test = line ? line + " " + word : word;

    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });

  if (line) lines.push(line);

  return lines;
}

// Draw animated caption
function drawCaption(text, centerY, settings, elapsed, isTop) {
  if (!text.trim()) return;

  const fontSize = settings.size;
  const font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
  const lines = wrapText(text, canvas.width - 70, font);
  const lineHeight = fontSize * 1.12;

  let offsetY = 0;
  let scale = 1;
  let rotation = 0;

  const seconds = elapsed / 1000;

  switch (settings.animation) {
    case "bounce":
      offsetY = Math.sin(seconds * 5 + (isTop ? 0 : 1)) * 7;
      break;

    case "pulse":
      scale = 1 + 0.05 * Math.sin(seconds * 5);
      break;

    case "shake":
      rotation = Math.sin(seconds * 25) * 0.025;
      break;

    case "slide":
      offsetY = -35 * (1 - Math.min(1, (seconds % 2) / 0.35));
      break;
  }

  ctx.save();

  ctx.translate(canvas.width / 2, centerY + offsetY);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";

  const maxWidth = canvas.width - 70;
  const totalHeight = lines.length * lineHeight;

  lines.forEach((line, index) => {
    let fittedSize = fontSize;

    ctx.font =
      `900 ${fittedSize}px Impact, "Arial Black", sans-serif`;

    while (
      ctx.measureText(line).width > maxWidth &&
      fittedSize > 14
    ) {
      fittedSize -= 1;
      ctx.font =
        `900 ${fittedSize}px Impact, "Arial Black", sans-serif`;
    }

    const y =
      -totalHeight / 2 + lineHeight * (index + 0.5);

    if (settings.outline) {
      ctx.strokeStyle = "#08080b";
      ctx.lineWidth = Math.max(4, fittedSize * 0.15);
      ctx.strokeText(line, 0, y, maxWidth);
    }

    ctx.fillStyle = settings.color;
    ctx.fillText(line, 0, y, maxWidth);
  });

  ctx.restore();
}

// Main canvas renderer
function drawMeme(elapsed = 0) {
  const template = templates[selected];
  const settings = getSettings();
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, template.c1);
  gradient.addColorStop(1, template.c2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Comic burst effect
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < 28; i++) {
    const angle = i * Math.PI / 14;

    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);

    ctx.lineTo(
      w / 2 + Math.cos(angle) * w,
      h / 2 + Math.sin(angle) * h
    );

    ctx.lineTo(
      w / 2 + Math.cos(angle + 0.035) * w,
      h / 2 + Math.sin(angle + 0.035) * h
    );

    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();

  // Emoji movement
  const bounce = settings.animation === "bounce"
    ? Math.sin(elapsed / 1000 * 5) * 10
    : 0;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '190px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
  ctx.shadowColor = "#0005";
  ctx.shadowBlur = 15;

  ctx.fillText(template.emoji, w / 2, h / 2 + bounce);

  ctx.restore();

  // Caption backgrounds
  const topBoxHeight = Math.max(76, settings.size * 2.25);
  const bottomBoxHeight = Math.max(76, settings.size * 2.25);

  roundRect(35, 35, w - 70, topBoxHeight, 18, "#05060dcc");

  roundRect(
    35,
    h - bottomBoxHeight - 35,
    w - 70,
    bottomBoxHeight,
    18,
    "#05060ddd"
  );

  drawCaption(
    settings.top,
    35 + topBoxHeight / 2,
    settings,
    elapsed,
    true
  );

  drawCaption(
    settings.bottom,
    h - bottomBoxHeight / 2 - 35,
    settings,
    elapsed,
    false
  );

  // Watermark
  ctx.save();
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = "right";
  ctx.fillStyle = "#ffffffbb";
  ctx.fillText("DESI MEME STUDIO", w - 40, h - 15);
  ctx.restore();
}

// Continuous animation
function animate(now) {
  drawMeme(now - startTime);
  requestAnimationFrame(animate);
}

// Update preview when settings change
function updatePreview() {
  sizeLabel.textContent = sizeInput.value + "px";
  drawMeme(performance.now() - startTime);
}

[
  topInput,
  bottomInput,
  sizeInput,
  colorInput,
  outlineInput,
  uppercaseInput,
  animationInput
].forEach(element => {
  element.addEventListener("input", updatePreview);
});

// Reset captions to selected template
document.getElementById("resetBtn").addEventListener("click", () => {
  selectTemplate(selected);
});

// Download PNG
document.getElementById("downloadPng").addEventListener("click", () => {
  try {
    drawMeme(performance.now() - startTime);

    canvas.toBlob(blob => {
      if (!blob) {
        setStatus("Could not create PNG.", true);
        return;
      }

      saveBlob(blob, "desi-college-meme.png");
      setStatus("PNG downloaded successfully!");
    }, "image/png");
  } catch (error) {
    setStatus("PNG export failed: " + error.message, true);
  }
});

// Save a blob as a downloadable file
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

// Export animated GIF
document.getElementById("downloadGif").addEventListener("click", async () => {
  if (typeof GIF === "undefined") {
    setStatus(
      "GIF library did not load. Check internet and reload the page.",
      true
    );
    return;
  }

  if (exportBusy) return;

  exportBusy = true;

  const button = document.getElementById("downloadGif");
  button.disabled = true;
  button.textContent = "Creating GIF...";

  try {
    const seconds = Number(durationInput.value);
    const fps = 10;
    const frameCount = seconds * fps;

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height,
      workerScript:
        "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js"
    });

    for (let i = 0; i < frameCount; i++) {
      drawMeme(i * (1000 / fps));

      gif.addFrame(canvas, {
        copy: true,
        delay: 1000 / fps
      });
    }

    setStatus("Rendering GIF. Please wait...");

    const blob = await new Promise((resolve, reject) => {
      gif.on("finished", resolve);

      gif.on("progress", progress => {
        setStatus("Creating GIF: " + Math.round(progress * 100) + "%");
      });

      gif.on("abort", () => reject(new Error("GIF export cancelled.")));

      gif.render();
    });

    saveBlob(blob, "desi-college-meme.gif");
    setStatus("GIF downloaded successfully!");
  } catch (error) {
    setStatus("GIF export failed. Try video or PNG.", true);
  } finally {
    exportBusy = false;
    button.disabled = false;
    button.textContent = "Export GIF";
  }
});

// Export animated video as WebM if supported
document.getElementById("downloadVideo").addEventListener("click", async () => {
  if (!window.MediaRecorder || !canvas.captureStream) {
    setStatus(
      "Video export is not supported in this browser. Try another browser.",
      true
    );
    return;
  }

  if (exportBusy) return;

  exportBusy = true;

  const button = document.getElementById("downloadVideo");
  button.disabled = true;
  button.textContent = "Recording...";

  let stream;

  try {
    const seconds = Number(durationInput.value);
    const types = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];

    const mimeType = types.find(type =>
      MediaRecorder.isTypeSupported(type)
    );

    const options = mimeType ? { mimeType } : undefined;

    stream = canvas.captureStream(24);

    const recorder = new MediaRecorder(stream, options);
    const chunks = [];

    recorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    const finished = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = () => reject(new Error("Recording failed."));
    });

    startTime = performance.now();
    recorder.start(200);

    setStatus("Recording meme animation...");

    await new Promise(resolve =>
      setTimeout(resolve, seconds * 1000)
    );

    recorder.stop();
    await finished;

    const blob = new Blob(chunks, {
      type: recorder.mimeType || "video/webm"
    });

    saveBlob(blob, "desi-college-meme.webm");

    setStatus(
      "Video downloaded as WebM. Browser support varies; MP4 conversion may be needed."
    );
  } catch (error) {
    setStatus("Video export failed: " + error.message, true);
  } finally {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    exportBusy = false;
    button.disabled = false;
    button.textContent = "Export Video";
  }
});

// Start the studio
buildTemplates();
selectTemplate(0);
requestAnimationFrame(animate);
