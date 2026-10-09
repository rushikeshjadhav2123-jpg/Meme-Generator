/* =========================================
   MEME STUDIO PRO
   Fabric.js 5.3.1
   Responsive Meme Editor
   ========================================= */
const canvas = new fabric.Canvas("c", {
  width: 600,
  height: 600,
  backgroundColor: "#161b22",
  preserveObjectStacking: true,
  selection: true
});
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = "#a855f7";
fabric.Object.prototype.cornerStrokeColor = "#ffffff";
fabric.Object.prototype.borderColor = "#a855f7";
fabric.Object.prototype.cornerSize = 10;
// Keep the original 600 x 600 canvas coordinates.
// Resize its displayed size for mobile and desktop.
function resizeMemeCanvas() {
  const workspace = document.querySelector(".canvas-workspace");
  const card = document.querySelector(".canvas-card");
  const container = canvas.wrapperEl;
  if (!workspace || !card || !container) return;
  const mobile = window.matchMedia("(max-width: 650px)").matches;
  const availableWidth = Math.max(
    160,
    Math.min(card.clientWidth - 12, workspace.clientWidth - 16)
  );
  const availableHeight = mobile
    ? Math.min(window.innerHeight * 0.60, 500)
    : 650;
  const scale = Math.min(
    availableWidth / 600,
    availableHeight / 600,
    1
  );
  const displaySize = Math.max(160, Math.round(600 * scale));
  container.style.width = displaySize + "px";
  container.style.height = displaySize + "px";
  container.style.maxWidth = "100%";
  // CSS-only resizing preserves the logical canvas dimensions.
  canvas.setDimensions(
    { width: displaySize, height: displaySize },
    { cssOnly: true }
  );
  canvas.calcOffset();
  canvas.requestRenderAll();
}
window.addEventListener("resize", resizeMemeCanvas);
window.addEventListener("orientationchange", () => {
  setTimeout(resizeMemeCanvas, 300);
});
// Run after the page layout has loaded.
requestAnimationFrame(resizeMemeCanvas);
/* =========================================
   NAVIGATION TABS
   ========================================= */
document.querySelectorAll(".tool-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tool-btn").forEach(item => {
      item.classList.remove("active");
    });
    document.querySelectorAll(".panel").forEach(panel => {
      panel.classList.remove("active");
    });
    button.classList.add("active");
    const panel = document.getElementById(
      "panel-" + button.dataset.target
    );
    if (panel) panel.classList.add("active");
    requestAnimationFrame(resizeMemeCanvas);
  });
});
/* =========================================
   IMAGE HELPERS
   ========================================= */
function addImageAsBackground(img) {
  if (!img) return;
  const maxWidth = canvas.width;
  const maxHeight = canvas.height;
  // Cover the canvas without stretching the image.
  const scale = Math.max(
    maxWidth / img.width,
    maxHeight / img.height
  );
  img.set({
    originX: "center",
    originY: "center",
    left: maxWidth / 2,
    top: maxHeight / 2,
    scaleX: scale,
    scaleY: scale,
    selectable: false,
    evented: false
  });
  canvas.setBackgroundImage(
    img,
    canvas.renderAll.bind(canvas)
  );
}
function loadPreset(url) {
  fabric.Image.fromURL(
    url,
    img => {
      if (!img) {
        alert("Image could not be loaded. Please try another template.");
        return;
      }
      addImageAsBackground(img);
      saveHistory();
    },
    { crossOrigin: "anonymous" }
  );
}
const imageUpload = document.getElementById("imageUpload");
imageUpload.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }
  const reader = new FileReader();
  reader.onload = result => {
    fabric.Image.fromURL(result.target.result, img => {
      if (!img) {
        alert("Could not open this image.");
        return;
      }
      addImageAsBackground(img);
      saveHistory();
    });
  };
  reader.readAsDataURL(file);
});
/* =========================================
   LAYOUT PRESETS
   ========================================= */
function applyLayout(layout) {
  canvas.clear();
  canvas.backgroundColor = "#161b22";
  canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
  const width = canvas.width;
  const height = canvas.height;
  function addDivider(x, y, w, h) {
    canvas.add(new fabric.Rect({
      left: x,
      top: y,
      width: w,
      height: h,
      fill: "#ffffff",
      selectable: false,
      evented: false
    }));
  }
  if (layout === "single") {
    canvas.backgroundColor = "#161b22";
  }
  if (layout === "2-panel-v") {
    canvas.backgroundColor = "#252538";
    addDivider(0, height / 2 - 2, width, 4);
  }
  if (layout === "2-panel-h") {
    canvas.backgroundColor = "#252538";
    addDivider(width / 2 - 2, 0, 4, height);
  }
  if (layout === "3-panel") {
    canvas.backgroundColor = "#252538";
    addDivider(width / 2 - 2, 0, 4, height);
    addDivider(0, height / 2 - 2, width / 2, 4);
  }
  canvas.renderAll();
  saveHistory();
}
/* =========================================
   ADD TEXT
   ========================================= */
function addText(text, options = {}) {
  const object = new fabric.IText(text, {
    left: options.left ?? 100,
    top: options.top ?? 100,
    fontFamily: options.fontFamily || "Impact",
    fontSize: options.fontSize || 40,
    fill: options.fill || "#ffffff",
    stroke: options.stroke || "#000000",
    strokeWidth: options.strokeWidth ?? 2,
    fontWeight: options.fontWeight || "bold",
    textAlign: "center",
    editable: true,
    padding: 5,
    ...options
  });
  canvas.add(object);
  canvas.setActiveObject(object);
  canvas.requestRenderAll();
  saveHistory();
  return object;
}
document.getElementById("addHeadingBtn").addEventListener("click", () => {
  addText("YOUR HEADLINE", {
    left: 100,
    top: 60,
    fontFamily: "Montserrat",
    fontSize: 36,
    strokeWidth: 1
  });
});
document.getElementById("addMemeTextBtn").addEventListener("click", () => {
  addText("TOP TEXT", {
    left: 100,
    top: 30,
    fontFamily: "Impact",
    fontSize: 48,
    strokeWidth: 3
  });
});
/* =========================================
   TEXT PROPERTY CONTROLS
   ========================================= */
function getSelectedText() {
  const object = canvas.getActiveObject();
  if (
    object &&
    ["i-text", "text", "textbox"].includes(object.type)
  ) {
    return object;
  }
  return null;
}
function updateTextProperty(property, value) {
  const object = getSelectedText();
  if (!object) return;
  object.set(property, value);
  object.setCoords();
  canvas.requestRenderAll();
}
document.getElementById("fontFamily").addEventListener("change", event => {
  updateTextProperty("fontFamily", event.target.value);
});
document.getElementById("textColor").addEventListener("input", event => {
  updateTextProperty("fill", event.target.value);
});
document.getElementById("strokeColor").addEventListener("input", event => {
  updateTextProperty("stroke", event.target.value);
});
document.getElementById("fontSize").addEventListener("input", event => {
  updateTextProperty("fontSize", Number(event.target.value));
});
document.getElementById("strokeWidth").addEventListener("input", event => {
  updateTextProperty("strokeWidth", Number(event.target.value));
});
function syncSelection() {
  const object = getSelectedText();
  if (!object) return;
  document.getElementById("fontFamily").value =
    object.fontFamily || "Impact";
  document.getElementById("textColor").value =
    typeof object.fill === "string" ? object.fill : "#ffffff";
  document.getElementById("strokeColor").value =
    typeof object.stroke === "string" ? object.stroke : "#000000";
  document.getElementById("fontSize").value = object.fontSize || 40;
  document.getElementById("strokeWidth").value = object.strokeWidth || 0;
}
canvas.on("selection:created", syncSelection);
canvas.on("selection:updated", syncSelection);
/* =========================================
   STICKERS / EMOJI
   ========================================= */
function addEmoji(emoji) {
  addText(emoji, {
    left: 200,
    top: 200,
    fontFamily: "Arial",
    fontSize: 64,
    strokeWidth: 0,
    fill: "#ffffff"
  });
}
/* =========================================
   SHAPES
   ========================================= */
function addShape(type) {
  let shape;
  if (type === "circle") {
    shape = new fabric.Circle({
      radius: 55,
      fill: "rgba(255,0,0,0.12)",
      stroke: "#ff3333",
      strokeWidth: 5
    });
  } else {
    shape = new fabric.Rect({
      width: 150,
      height: 90,
      fill: "rgba(255,255,255,0.12)",
      stroke: "#ffffff",
      strokeWidth: 3
    });
  }
  shape.set({
    left: 220,
    top: 220,
    originX: "center",
    originY: "center"
  });
  canvas.add(shape);
  canvas.setActiveObject(shape);
  canvas.requestRenderAll();
  saveHistory();
}
function addSpeechBubble() {
  const bubble = new fabric.Group([
    new fabric.Rect({
      width: 180,
      height: 90,
      rx: 16,
      ry: 16,
      fill: "#ffffff",
      stroke: "#111111",
      strokeWidth: 2,
      originX: "center",
      originY: "center"
    }),
    new fabric.Triangle({
      width: 24,
      height: 22,
      fill: "#ffffff",
      stroke: "#111111",
      angle: 180,
      left: -45,
      top: 43,
      originX: "center",
      originY: "center"
    }),
    new fabric.IText("SAY SOMETHING!", {
      fontSize: 15,
      fontFamily: "Arial",
      fill: "#111111",
      originX: "center",
      originY: "center",
      textAlign: "center"
    })
  ], {
    left: 210,
    top: 180,
    originX: "center",
    originY: "center"
  });
  canvas.add(bubble);
  canvas.setActiveObject(bubble);
  canvas.requestRenderAll();
  saveHistory();
}
function addArrow() {
  const arrow = new fabric.Group([
    new fabric.Line([0, 0, 100, 0], {
      stroke: "#ff3333",
      strokeWidth: 7,
      originX: "center",
      originY: "center"
    }),
    new fabric.Triangle({
      left: 55,
      top: 0,
      width: 24,
      height: 28,
      fill: "#ff3333",
      angle: 90,
      originX: "center",
      originY: "center"
    })
  ], {
    left: 200,
    top: 200
  });
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.requestRenderAll();
  saveHistory();
}
/* =========================================
   DRAWING BRUSH
   ========================================= */
const drawModeToggle = document.getElementById("drawModeToggle");
drawModeToggle.addEventListener("change", event => {
  canvas.isDrawingMode = event.target.checked;
  if (canvas.isDrawingMode) {
    canvas.discardActiveObject();
  }
  canvas.freeDrawingBrush.color =
    document.getElementById("brushColor").value;
  canvas.freeDrawingBrush.width =
    Number(document.getElementById("brushWidth").value);
  canvas.requestRenderAll();
});
document.getElementById("brushColor").addEventListener("input", event => {
  canvas.freeDrawingBrush.color = event.target.value;
});
document.getElementById("brushWidth").addEventListener("input", event => {
  canvas.freeDrawingBrush.width = Number(event.target.value);
});
canvas.on("path:created", saveHistory);
/* =========================================
   IMAGE FILTERS
   ========================================= */
let filterTarget = null;
function getFilterImage() {
  const object = canvas.getActiveObject();
  if (object && object.type === "image") {
    return object;
  }
  const background = canvas.backgroundImage;
  if (background && background.type === "image") {
    return background;
  }
  return null;
}
function applyImageFilters() {
  filterTarget = getFilterImage();
  if (!filterTarget) return;
  const brightness = Number(
    document.getElementById("filterBrightness").value
  );
  const contrast = Number(
    document.getElementById("filterContrast").value
  );
  const saturation = Number(
    document.getElementById("filterSaturate").value
  );
  const blur = Number(
    document.getElementById("filterBlur").value
  );
  filterTarget.filters = [
    new fabric.Image.filters.Brightness({ brightness }),
    new fabric.Image.filters.Contrast({ contrast }),
    new fabric.Image.filters.Saturation({ saturation }),
    new fabric.Image.filters.Blur({ blur })
  ];
  filterTarget.applyFilters();
  canvas.requestRenderAll();
}
[
  "filterBrightness",
  "filterContrast",
  "filterSaturate",
  "filterBlur"
].forEach(id => {
  document.getElementById(id).addEventListener("input", applyImageFilters);
});
document.getElementById("resetFiltersBtn").addEventListener("click", () => {
  [
    ["filterBrightness", 0],
    ["filterContrast", 0],
    ["filterSaturate", 0],
    ["filterBlur", 0]
  ].forEach(([id, value]) => {
    document.getElementById(id).value = value;
  });
  const target = getFilterImage();
  if (target) {
    target.filters = [];
    target.applyFilters();
    canvas.requestRenderAll();
  }
});
document.getElementById("deepFriedBtn").addEventListener("click", () => {
  const target = getFilterImage();
  if (!target) {
    alert("Load an image first to apply this filter.");
    return;
  }
  target.filters = [
    new fabric.Image.filters.Contrast({ contrast: 0.45 }),
    new fabric.Image.filters.Saturation({ saturation: 0.8 }),
    new fabric.Image.filters.Brightness({ brightness: 0.08 })
  ];
  target.applyFilters();
  canvas.requestRenderAll();
  saveHistory();
});
/* =========================================
   LAYER PANEL
   ========================================= */
function updateLayerPanel() {
  const list = document.getElementById("layerList");
  if (!list) return;
  list.innerHTML = "";
  const objects = canvas.getObjects().slice().reverse();
  if (!objects.length) {
    list.textContent = "No layers yet.";
    return;
  }
  objects.forEach((object, reverseIndex) => {
    const originalIndex = canvas.getObjects().length - 1 - reverseIndex;
    const item = document.createElement("button");
    item.type = "button";
    item.className = "layer-item";
    const label = object.type === "i-text" || object.type === "text"
      ? object.text
      : object.type;
    item.textContent = `${originalIndex + 1}. ${label || "Object"}`;
    item.style.width = "100%";
    item.style.textAlign = "left";
    item.style.marginBottom = "5px";
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      canvas.setActiveObject(object);
      canvas.requestRenderAll();
      syncSelection();
    });
    list.appendChild(item);
  });
}
canvas.on("object:added", updateLayerPanel);
canvas.on("object:removed", updateLayerPanel);
canvas.on("object:modified", updateLayerPanel);
/* =========================================
   ACTIVE OBJECT ACTIONS
   ========================================= */
document.getElementById("btnBringForward").addEventListener("click", () => {
  const object = canvas.getActiveObject();
  if (!object) return;
  canvas.bringForward(object);
  canvas.requestRenderAll();
  saveHistory();
});
document.getElementById("btnSendBackward").addEventListener("click", () => {
  const object = canvas.getActiveObject();
  if (!object) return;
  canvas.sendBackwards(object);
  canvas.requestRenderAll();
  saveHistory();
});
document.getElementById("btnDuplicate").addEventListener("click", () => {
  const object = canvas.getActiveObject();
  if (!object) return;
  object.clone(clone => {
    clone.set({
      left: (object.left || 0) + 20,
      top: (object.top || 0) + 20
    });
    canvas.add(clone);
    canvas.setActiveObject(clone);
    canvas.requestRenderAll();
    saveHistory();
  });
});
document.getElementById("btnDeleteSelected").addEventListener("click", () => {
  const object = canvas.getActiveObject();
  if (!object) return;
  canvas.remove(object);
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  saveHistory();
});
/* =========================================
   CLEAR CANVAS
   ========================================= */
document.getElementById("btnClear").addEventListener("click", () => {
  if (!confirm("Clear the canvas?")) return;
  canvas.clear();
  canvas.backgroundColor = "#161b22";
  canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
  canvas.setBackgroundColor("#161b22", canvas.renderAll.bind(canvas));
  saveHistory();
});
/* =========================================
   UNDO / REDO HISTORY
   ========================================= */
let history = [];
let historyIndex = -1;
let restoringHistory = false;
function getCanvasState() {
  return JSON.stringify(canvas.toJSON());
}
function saveHistory() {
  if (restoringHistory) return;
  const state = getCanvasState();
  if (history[historyIndex] === state) return;
  history = history.slice(0, historyIndex + 1);
  history.push(state);
  if (history.length > 40) {
    history.shift();
  }
  historyIndex = history.length - 1;
}
function restoreHistory(index) {
  if (index < 0 || index >= history.length) return;
  restoringHistory = true;
  canvas.loadFromJSON(history[index], () => {
    canvas.requestRenderAll();
    updateLayerPanel();
    restoringHistory = false;
  });
}
canvas.on("object:modified", saveHistory);
canvas.on("text:changed", saveHistory);
document.getElementById("btnUndo").addEventListener("click", () => {
  if (historyIndex <= 0) return;
  historyIndex--;
  restoreHistory(historyIndex);
});
document.getElementById("btnRedo").addEventListener("click", () => {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  restoreHistory(historyIndex);
});
// Initial history state
saveHistory();
/* =========================================
   SAVE / LOAD PROJECT JSON
   ========================================= */
document.getElementById("saveProjectBtn").addEventListener("click", () => {
  const json = JSON.stringify(canvas.toJSON(), null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "meme-studio-project.json";
  link.click();
  URL.revokeObjectURL(url);
});
document.getElementById("loadProjectInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = result => {
    try {
      const data = JSON.parse(result.target.result);
      restoringHistory = true;
      canvas.loadFromJSON(data, () => {
        canvas.requestRenderAll();
        updateLayerPanel();
        restoringHistory = false;
        saveHistory();
      });
    } catch (error) {
      alert("Invalid project JSON file.");
      restoringHistory = false;
    }
  };
  reader.readAsText(file);
  event.target.value = "";
});
/* =========================================
   EXPORT HD PNG
   ========================================= */
document.getElementById("downloadBtn").addEventListener("click", () => {
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  try {
    const dataURL = canvas.toDataURL({
      format: "png",
      multiplier: 2
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "meme-studio-hd.png";
    link.click();
  } catch (error) {
    alert("Export failed. An external image may block downloading.");
  }
});
/* =========================================
   COPY IMAGE
   ========================================= */
document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    const dataURL = canvas.toDataURL({ format: "png" });
    const response = await fetch(dataURL);
    const blob = await response.blob();
    if (!navigator.clipboard || !window.ClipboardItem) {
      alert("Image copying is not supported here. Use Export HD instead.");
      return;
    }
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
    alert("Meme copied!");
  } catch (error) {
    alert("Copy failed. Try Export HD instead.");
  }
});
/* =========================================
   INITIALIZATION
   ========================================= */
updateLayerPanel();
resizeMemeCanvas();
console.log("Meme Studio Pro initialized successfully.");
