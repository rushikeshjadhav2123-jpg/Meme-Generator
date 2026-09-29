// Initialize Fabric.js Canvas
const canvas = new fabric.Canvas('c', {
  width: 600,
  height: 600,
  backgroundColor: '#161b22'
});

// Navigation Tabs Handler
document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`panel-${btn.dataset.target}`).classList.add('active');
  });
});

// Load Preset Image
function loadPreset(url) {
  fabric.Image.fromURL(url, (img) => {
    img.scaleToWidth(canvas.width);
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  }, { crossOrigin: 'anonymous' });
}

// Custom Upload Image
document.getElementById('imageUpload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result, (img) => {
        img.scaleToWidth(canvas.width);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    };
    reader.readAsDataURL(file);
  }
});

// Add Text Functions
document.getElementById('addHeadingBtn').addEventListener('click', () => {
  const text = new fabric.IText('HEADLINE TEXT', {
    left: canvas.width / 2 - 100,
    top: 50,
    fontFamily: 'Montserrat',
    fill: '#ffffff',
    fontSize: 36,
    stroke: '#000000',
    strokeWidth: 1
  });
  canvas.add(text);
  canvas.setActiveObject(text);
});

document.getElementById('addMemeTextBtn').addEventListener('click', () => {
  const text = new fabric.IText('TOP TEXT', {
    left: canvas.width / 2 - 120,
    top: 30,
    fontFamily: 'Impact',
    fill: '#ffffff',
    fontSize: 48,
    stroke: '#000000',
    strokeWidth: 3,
    fontWeight: 'bold'
  });
  canvas.add(text);
  canvas.setActiveObject(text);
});

// Synchronize Controls with Active Selected Object
canvas.on('selection:created', syncSelection);
canvas.on('selection:updated', syncSelection);
canvas.on('object:added', updateLayerPanel);
canvas.on('object:removed', updateLayerPanel);

function syncSelection() {
  const obj = canvas.getActiveObject();
  if (!obj) return;

  if (obj.type === 'i-text' || obj.type === 'text') {
    document.getElementById('fontFamily').value = obj.fontFamily || 'Impact';
    document.getElementById('textColor').value = obj.fill || '#ffffff';
    document.getElementById('strokeColor').value = obj.stroke || '#000000';
    document.getElementById('fontSize').value = obj.fontSize || 40;
    document.getElementById('strokeWidth').value = obj.strokeWidth || 0;
  }
  updateLayerPanel();
}

// Dynamic Property Listeners
document.getElementById('fontFamily').addEventListener('change', (e) => {
  const obj = canvas.getActiveObject();
  if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
    obj.set('fontFamily', e.target.value);
    canvas.renderAll();
  }
});

document.getElementById('textColor').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('fill', e.target.value);
    canvas.renderAll();
  }
});

document.getElementById('strokeColor').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('stroke', e.target.value);
    canvas.renderAll();
  }
});

document.getElementById('fontSize').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
    obj.set('fontSize', parseInt(e.target.value));
    canvas.renderAll();
  }
});

document.getElementById('strokeWidth').addEventListener('input', (e) => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.set('strokeWidth', parseInt(e.target.value));
    canvas.renderAll();
  }
});

// Add Emojis / Stickers
function addEmoji(emojiStr) {
  const text = new fabric.Text(emojiStr, {
    left: canvas.width / 2 - 25,
    top: canvas.height / 2 - 25,
    fontSize: 60
  });
  canvas.add(text);
  canvas.setActiveObject(text);
}

// Shapes
function addShape(shapeType) {
  let shape;
  if (shapeType === 'rect') {
    shape = new fabric.Rect({ left: 100, top: 100, fill: '#ff0055', width: 100, height: 100 });
  } else if (shapeType === 'circle') {
    shape = new fabric.Circle({ left: 100, top: 100, fill: 'transparent', stroke: '#ff0000', strokeWidth: 5, radius: 50 });
  }
  canvas.add(shape);
}

// Freehand Brush / Doodle
const drawToggle = document.getElementById('drawModeToggle');
drawToggle.addEventListener('change', (e) => {
  canvas.isDrawingMode = e.target.checked;
  if (canvas.isDrawingMode) {
    canvas.freeDrawingBrush.color = document.getElementById('brushColor').value;
    canvas.freeDrawingBrush.width = parseInt(document.getElementById('brushWidth').value);
  }
});

document.getElementById('brushColor').addEventListener('input', (e) => {
  if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.color = e.target.value;
});

document.getElementById('brushWidth').addEventListener('input', (e) => {
  if (canvas.freeDrawingBrush) canvas.freeDrawingBrush.width = parseInt(e.target.value);
});

// Filters
document.getElementById('deepFriedBtn').addEventListener('click', () => {
  const bg = canvas.backgroundImage;
  if (!bg) return alert('Please upload or select an image background first!');

  bg.filters = [
    new fabric.Image.filters.Contrast({ contrast: 0.8 }),
    new fabric.Image.filters.Saturate({ saturation: 2.0 }),
    new fabric.Image.filters.Noise({ noise: 200 })
  ];
  bg.applyFilters();
  canvas.renderAll();
});

document.getElementById('resetFiltersBtn').addEventListener('click', () => {
  const bg = canvas.backgroundImage;
  if (bg) {
    bg.filters = [];
    bg.applyFilters();
    canvas.renderAll();
  }
});

// Layer Actions
function updateLayerPanel() {
  const layerList = document.getElementById('layerList');
  layerList.innerHTML = '';
  const activeObj = canvas.getActiveObject();

  canvas.getObjects().forEach((obj, idx) => {
    const item = document.createElement('div');
    item.className = `layer-item ${obj === activeObj ? 'active' : ''}`;
    item.innerText = `${idx + 1}. ${obj.type.toUpperCase()} (${obj.text ? obj.text.substring(0, 10) : 'Item'})`;
    item.onclick = () => {
      canvas.setActiveObject(obj);
      canvas.renderAll();
    };
    layerList.appendChild(item);
  });
}

document.getElementById('btnBringForward').addEventListener('click', () => {
  const obj = canvas.getActiveObject();
  if (obj) { canvas.bringForward(obj); canvas.renderAll(); }
});

document.getElementById('btnSendBackward').addEventListener('click', () => {
  const obj = canvas.getActiveObject();
  if (obj) { canvas.sendBackwards(obj); canvas.renderAll(); }
});

document.getElementById('btnDuplicate').addEventListener('click', () => {
  const obj = canvas.getActiveObject();
  if (obj) {
    obj.clone((cloned) => {
      cloned.set({ left: obj.left + 20, top: obj.top + 20 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
    });
  }
});

document.getElementById('btnDeleteSelected').addEventListener('click', () => {
  const obj = canvas.getActiveObject();
  if (obj) canvas.remove(obj);
});

document.getElementById('btnClear').addEventListener('click', () => {
  if (confirm('Clear entire canvas?')) {
    canvas.clear();
    canvas.setBackgroundColor('#161b22', canvas.renderAll.bind(canvas));
  }
});

// Export & Save JSON Project
document.getElementById('saveProjectBtn').addEventListener('click', () => {
  const json = JSON.stringify(canvas.toJSON());
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'meme-project.json';
  a.click();
});

document.getElementById('loadProjectInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (f) => {
      canvas.loadFromJSON(f.target.result, canvas.renderAll.bind(canvas));
    };
    reader.readAsText(file);
  }
});

// Download & Copy HD
document.getElementById('downloadBtn').addEventListener('click', () => {
  canvas.discardActiveObject();
  canvas.renderAll();

  const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
  const link = document.createElement('a');
  link.download = 'meme-pro-export.png';
  link.href = dataURL;
  link.click();
});

document.getElementById('copyBtn').addEventListener('click', () => {
  canvas.discardActiveObject();
  canvas.renderAll();

  canvas.getElement().toBlob(blob => {
    navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]).then(() => alert('Meme copied to clipboard!'));
  });
});

// Load Initial Preset
loadPreset('https://api.memegen.link/images/drake.png');