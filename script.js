
/* ==========================================
   MEME GENERATOR - FREE CARTOON MODE
   No API key | No backend | Canvas drawing
   ========================================== */

const $ = (id) => document.getElementById(id);

const canvas = $("memeCanvas");
if (!canvas) throw new Error('Missing #memeCanvas in index.html');

const ctx = canvas.getContext("2d");

let uploadedPhoto = null;
let sceneNumber = 0;

const captionSets = {
  Funny: [
    ["ME: TODAY I WILL STUDY", "MY BED: COME HERE BRO 😂"],
    ["JUST FIVE MORE MINUTES", "WAKES UP TOMORROW"],
    ["MY BRAIN HAS TWO MODES", "SLEEP OR EAT"],
    ["EXPECTATION: MILLIONAIRE", "REALITY: CHECKING BALANCE"],
    ["I HAVE A MASTER PLAN", "STEP 1: PANIC"],
    ["ME ACTING NORMAL", "BRAIN RUNNING 47 SCENARIOS"],
    ["WHEN WIFI STOPS WORKING", "LIFE HAS NO MEANING"],
    ["I AM VERY PRODUCTIVE", "AT AVOIDING MY WORK"]
  ],
  Savage: [
    ["I KNOW MY WORTH", "NO DISCOUNT TODAY 😎"],
    ["I AM NOT IGNORING YOU", "I AM PROTECTING MY PEACE"],
    ["YOUR OPINION MATTERS", "JUST NOT TO ME"],
    ["MY LIFE MY RULES", "MY MOM: ABSOLUTELY NOT"],
    ["SILENCE IS GOLDEN", "SO I AM VERY RICH"]
  ],
  Relatable: [
    ["SALARY ARRIVED", "BILLS SAID HELLO 💸"],
    ["MONDAY MORNING", "I NEED ANOTHER SUNDAY"],
    ["PHONE AT 1% BATTERY", "ME AT 100% PANIC"],
    ["OPENING THE FRIDGE AGAIN", "EXPECTING NEW FOOD"],
    ["EXAM TOMORROW", "SYLLABUS STILL UNTOUCHED"]
  ],
  Sarcastic: [
    ["OH, GREAT IDEA!", "WHAT COULD POSSIBLY GO WRONG?"],
    ["I LOVE GROUP PROJECTS", "DOING ALL THE WORK"],
    ["EVERYTHING IS UNDER CONTROL", "NOTHING IS UNDER CONTROL"],
    ["SURE, I AM LISTENING", "MY BRAIN IS ON VACATION"]
  ],
  "Dark humor": [
    ["MY FUTURE IS BRIGHT", "POWER CUT AGAIN"],
    ["LIFE GIVES YOU LESSONS", "WITHOUT THE STUDY MATERIAL"],
    ["MY PLANS ARE SOLID", "MY MOTIVATION IS NOT"]
  ],
  Wholesome: [
    ["YOU ARE DOING GREAT", "KEEP GOING, LEGEND ❤️"],
    ["SMALL STEPS EVERY DAY", "BIG THINGS WILL COME"],
    ["BAD DAY?", "TOMORROW IS ANOTHER CHANCE"]
  ]
};

const topicSets = {
  exam: [
    ["EXAM TOMORROW", "SYLLABUS STILL LOADING 📚"],
    ["ME: I KNOW EVERYTHING", "QUESTION PAPER: PROVE IT"],
    ["OPENED THE BOOK", "SUDDENLY FEELING SLEEPY"]
  ],
  college: [
    ["ATTENDING COLLEGE", "JUST FOR ATTENDANCE"],
    ["COLLEGE LIFE IS FUN", "UNTIL ASSIGNMENTS ARRIVE"]
  ],
  sleep: [
    ["JUST FIVE MORE MINUTES", "THREE HOURS LATER..."],
    ["BODY: TIME TO SLEEP", "BRAIN: REMEMBER 2018?"]
  ],
  food: [
    ["DIET STARTS TOMORROW", "TODAY IS A SPECIAL CASE"],
    ["SHARING IS CARING", "EXCEPT MY FAVOURITE FOOD"]
  ],
  money: [
    ["SALARY IN", "SALARY OUT 💸"],
    ["CHECKING MY BANK BALANCE", "CLOSE APP IMMEDIATELY"]
  ],
  love: [
    ["WAITING FOR A TEXT", "PHONE: SILENCE"],
    ["LOVE IS IN THE AIR", "SO IS MY OVERTHINKING"]
  ]
};

const scenes = [
  { bg: "#ffb86c", shirt: "#4937a8", mood: "sleepy" },
  { bg: "#8be9fd", shirt: "#ff477e", mood: "shocked" },
  { bg: "#c7f9cc", shirt: "#176b52", mood: "happy" },
  { bg: "#ffc6ff", shirt: "#6c4ab6", mood: "crying" },
  { bg: "#ffe66d", shirt: "#e76f51", mood: "silly" },
  { bg: "#bde0fe", shirt: "#315cbb", mood: "angry" }
];

function setStatus(message) {
  const el = $("status");
  if (el) el.textContent = message;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function chooseCaptions() {
  const mood = $("mood")?.value || "Funny";
  const idea = ($("idea")?.value || "").toLowerCase();

  const topics = [
    ["exam", /\b(exam|test|paper|marks|study|studying|syllabus)\b/],
    ["college", /\b(college|class|teacher|lecture|attendance)\b/],
    ["sleep", /\b(sleep|sleepy|tired|bed|nap)\b/],
    ["food", /\b(food|eat|hungry|pizza|burger|snack)\b/],
    ["money", /\b(money|salary|bill|bank|broke|shopping)\b/],
    ["love", /\b(love|crush|date|dating|romance|single)\b/]
  ];

  for (const [topic, regex] of topics) {
    if (regex.test(idea)) return randomItem(topicSets[topic]);
  }

  return randomItem(captionSets[mood] || captionSets.Funny);
}

/* Draw a cartoon-style character from scratch */
function drawCartoon(scene) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;

  // Background
  ctx.fillStyle = scene.bg;
  ctx.fillRect(0, 0, w, h);

  // Decorative dots
  for (let i = 0; i < 18; i++) {
    const x = (i * 137 + 43) % w;
    const y = (i * 83 + 40) % h;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(x, y, 5 + (i % 4) * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Neck
  ctx.fillStyle = "#d99b72";
  ctx.fillRect(cx - 30, h * 0.61, 60, 60);

  // Body / shirt
  ctx.fillStyle = scene.shirt;
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.91, w * 0.34, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = "#e8ae83";
  ctx.beginPath();
  ctx.ellipse(cx - 91, h * 0.40, 18, 29, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 91, h * 0.40, 18, 29, 0, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = "#f3c39c";
  ctx.strokeStyle = "#5c3427";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, h * 0.40, 91, 111, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hair
  ctx.fillStyle = "#39251e";
  ctx.beginPath();
  ctx.arc(cx, h * 0.32, 91, Math.PI, Math.PI * 2);
  ctx.lineTo(cx + 83, h * 0.34);
  ctx.quadraticCurveTo(cx + 35, h * 0.28, cx, h * 0.34);
  ctx.quadraticCurveTo(cx - 48, h * 0.25, cx - 83, h * 0.35);
  ctx.closePath();
  ctx.fill();

  // Eyebrows and eyes vary by expression
  ctx.strokeStyle = "#39251e";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  if (scene.mood === "angry") {
    ctx.beginPath();
    ctx.moveTo(cx - 61, h * 0.37);
    ctx.lineTo(cx - 27, h * 0.39);
    ctx.moveTo(cx + 27, h * 0.39);
    ctx.lineTo(cx + 61, h * 0.37);
    ctx.stroke();
  } else if (scene.mood === "shocked") {
    ctx.beginPath();
    ctx.moveTo(cx - 60, h * 0.34);
    ctx.quadraticCurveTo(cx - 42, h * 0.29, cx - 25, h * 0.35);
    ctx.moveTo(cx + 25, h * 0.35);
    ctx.quadraticCurveTo(cx + 42, h * 0.29, cx + 60, h * 0.34);
    ctx.stroke();
  }

  ctx.fillStyle = "#fff";
  if (scene.mood === "sleepy") {
    ctx.fillRect(cx - 61, h * 0.40, 39, 8);
    ctx.fillRect(cx + 22, h * 0.40, 39, 8);
  } else {
    ctx.beginPath();
    ctx.ellipse(cx - 42, h * 0.40, 19, scene.mood === "shocked" ? 23 : 15, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 42, h * 0.40, 19, scene.mood === "shocked" ? 23 : 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#241a16";
    ctx.beginPath();
    ctx.arc(cx - 40, h * 0.40, 8, 0, Math.PI * 2);
    ctx.arc(cx + 40, h * 0.40, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nose
  ctx.strokeStyle = "#bd805d";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.42);
  ctx.lineTo(cx - 8, h * 0.49);
  ctx.lineTo(cx + 6, h * 0.49);
  ctx.stroke();

  // Mouth expressions
  ctx.strokeStyle = "#632e2b";
  ctx.fillStyle = "#8c3131";
  ctx.lineWidth = 5;
  ctx.beginPath();

  if (scene.mood === "sleepy") {
    ctx.ellipse(cx, h * 0.55, 13, 19, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (scene.mood === "shocked") {
    ctx.ellipse(cx, h * 0.56, 19, 25, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (scene.mood === "angry") {
    ctx.moveTo(cx - 27, h * 0.57);
    ctx.lineTo(cx + 27, h * 0.57);
    ctx.stroke();
  } else {
    ctx.moveTo(cx - 34, h * 0.53);
    ctx.quadraticCurveTo(cx, h * 0.63, cx + 34, h * 0.53);
    ctx.stroke();
  }

  // Expression details
  ctx.font = "bold 34px sans-serif";
  if (scene.mood === "crying") {
    ctx.fillStyle = "#3298dc";
    ctx.fillText("💧", cx - 73, h * 0.48);
    ctx.fillText("💧", cx + 72, h * 0.48);
  } else if (scene.mood === "shocked") {
    ctx.fillText("!", cx + 100, h * 0.27);
  } else if (scene.mood === "sleepy") {
    ctx.fillText("Z", cx + 95, h * 0.28);
    ctx.fillText("z", cx + 115, h * 0.23);
  } else if (scene.mood === "happy") {
    ctx.fillText("✨", cx + 93, h * 0.30);
  } else if (scene.mood === "angry") {
    ctx.fillText("💢", cx + 92, h * 0.31);
  }

  // Small signature decoration
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.font = "bold 15px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("MEME STUDIO", w - 12, h - 12);
  ctx.textAlign = "center";
}

/* Draw top and bottom captions */
function drawCaption(text, position) {
  if (!text || !text.trim()) return;

  const w = canvas.width;
  const h = canvas.height;
  const maxWidth = w * 0.92;

  let fontSize = Number($("fontSize")?.value) || 44;
  fontSize = Math.min(fontSize, w * 0.09);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(3, fontSize * 0.1);
  ctx.strokeStyle = "#000";
  ctx.fillStyle = $("textColor")?.value || "#fff";

  const words = text.toUpperCase().split(/\s+/);
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

  const lineHeight = fontSize * 1.15;
  const yStart = position === "top"
    ? 30 + lineHeight / 2
    : h - 30 - lineHeight * (lines.length - 1) - lineHeight / 2;

  lines.forEach((item, i) => {
    const y = yStart + i * lineHeight;
    ctx.strokeText(item, w / 2, y, maxWidth);
    ctx.fillText(item, w / 2, y, maxWidth);
  });
}

function renderMeme() {
  canvas.width = 700;
  canvas.height = 700;

  if (uploadedPhoto) {
    const scale = Math.min(
      canvas.width / uploadedPhoto.width,
      canvas.height / uploadedPhoto.height
    );
    const dw = uploadedPhoto.width * scale;
    const dh = uploadedPhoto.height * scale;

    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      uploadedPhoto,
      (canvas.width - dw) / 2,
      (canvas.height - dh) / 2,
      dw,
      dh
    );
  } else {
    const mood = $("mood")?.value || "Funny";
    const scene = randomItem(scenes);
    drawCartoon(scene);
  }

  drawCaption($("topText")?.value || "", "top");
  drawCaption($("bottomText")?.value || "", "bottom");

  canvas.hidden = false;
  if ($("emptyState")) $("emptyState").hidden = true;
}

function generateMeme() {
  const captions = chooseCaptions();

  if ($("topText")) $("topText").value = captions[0];
  if ($("bottomText")) $("bottomText").value = captions[1];

  sceneNumber++;
  renderMeme();
  setStatus("New funny meme created! Download it or generate another 😂");
}

/* Optional uploaded photo */
if ($("imageInput")) {
  $("imageInput").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        uploadedPhoto = img;
        if ($("uploadTitle")) $("uploadTitle").textContent = "Image ready";
        if ($("uploadInfo")) $("uploadInfo").textContent = file.name;
        renderMeme();
        setStatus("Your photo is ready! Generate or edit captions.");
      };
      img.onerror = () => setStatus("Could not load the selected image.");
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* Generate button */
if ($("generateButton")) {
  $("generateButton").addEventListener("click", generateMeme);
}

/* Preview button */
if ($("redrawButton")) {
  $("redrawButton").addEventListener("click", renderMeme);
}

/* Update preview when editing captions */
["topText", "bottomText", "textColor", "fontSize"].forEach((id) => {
  if ($(id)) {
    $(id).addEventListener("input", () => {
      if (canvas && !canvas.hidden) renderMeme();
    });
  }
});

/* Download as PNG */
if ($("downloadButton")) {
  $("downloadButton").addEventListener("click", () => {
    if (canvas.hidden) {
      setStatus("Generate a meme first!");
      return;
    }

    const link = document.createElement("a");
    link.download = "funny-meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("Meme downloaded! 🎉");
  });
}

/* Create a starter meme automatically */
generateMeme();
