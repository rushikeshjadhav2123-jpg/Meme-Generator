
const $ = id => document.getElementById(id);

const canvas = $("memeCanvas");
const ctx = canvas.getContext("2d");

let photo = null;

const captions = {
  Funny: [
    ["ME: I WILL STUDY TODAY", "ALSO ME: OPENS INSTAGRAM"],
    ["JUST 5 MINUTES MORE", "3 HOURS LATER..."],
    ["POV: EXAM TOMORROW", "SYLLABUS STILL UNTOUCHED"]
  ],
  Savage: [
    ["I AM NOT IGNORING YOU", "YOU ARE JUST NOT IMPORTANT"],
    ["MY LIFE MY RULES", "MY MOM: NO"],
    ["I KNOW MY WORTH", "THAT'S WHY I SLEEP"]
  ],
  Relatable: [
    ["SALARY ARRIVED", "BILLS SAID HELLO"],
    ["MONDAY MORNING", "I NEED ANOTHER SUNDAY"],
    ["I SHOULD SLEEP EARLY", "2 AM: ONE MORE VIDEO"]
  ],
  Sarcastic: [
    ["OH, GREAT IDEA!", "WHAT COULD GO WRONG?"],
    ["I LOVE GROUP PROJECTS", "DOING ALL THE WORK"],
    ["I AM VERY PRODUCTIVE", "AT AVOIDING WORK"]
  ],
  "Dark humor": [
    ["MY FUTURE IS BRIGHT", "POWER CUT AGAIN"],
    ["LIFE IS FULL OF SURPRISES", "MOSTLY UNPAID BILLS"]
  ],
  Wholesome: [
    ["YOU ARE DOING GREAT", "KEEP GOING ❤️"],
    ["SMALL STEPS EVERY DAY", "BIG THINGS WILL COME"]
  ]
};

$("imageInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    $("status").textContent = "Please choose an image.";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();

    img.onload = () => {
      photo = img;
      $("uploadTitle").textContent = "Image ready";
      $("uploadInfo").textContent = file.name;
      $("status").textContent = "Photo uploaded! Generate your meme.";
      drawMeme();
    };

    img.onerror = () => {
      $("status").textContent = "Could not load this image.";
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

function drawMeme() {
  if (!photo) {
    $("status").textContent = "First upload a photo!";
    return;
  }

  const scale = Math.min(
    1,
    1000 / Math.max(photo.width, photo.height)
  );

  canvas.width = Math.round(photo.width * scale);
  canvas.height = Math.round(photo.height * scale);

  ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);

  const size = Number($("fontSize").value) *
    canvas.width / 800;

  ctx.font = `900 ${size}px Impact, Arial Black, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(3, size * 0.09);
  ctx.strokeStyle = "black";
  ctx.fillStyle = $("textColor").value;

  function writeCaption(text, y, top) {
    if (!text.trim()) return;

    const words = text.toUpperCase().split(/\s+/);
    const lines = [];
    let line = "";

    for (const word of words) {
      const test = line ? line + " " + word : word;

      if (ctx.measureText(test).width > canvas.width * 0.9 && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }

    if (line) lines.push(line);

    lines.forEach((item, i) => {
      const yy = top
        ? y + i * size * 1.15
        : y - (lines.length - 1 - i) * size * 1.15;

      ctx.strokeText(item, canvas.width / 2, yy, canvas.width * 0.9);
      ctx.fillText(item, canvas.width / 2, yy, canvas.width * 0.9);
    });
  }

  writeCaption(
    $("topText").value,
    size * 1.2,
    true
  );

  writeCaption(
    $("bottomText").value,
    canvas.height - size * 1.2,
    false
  );

  canvas.hidden = false;
  $("emptyState").hidden = true;
}

$("generateButton").addEventListener("click", () => {
  if (!photo) {
    $("status").textContent = "Upload a photo first!";
    return;
  }

  const mood = $("mood").value;
  const idea = $("idea").value.toLowerCase();

  let choices = captions[mood] || captions.Funny;

  if (idea.includes("exam") || idea.includes("study")) {
    choices = [
      ["ME STUDYING ALL NIGHT", "BRAIN LOADING..."],
      ["EXAM PAPER IN FRONT OF ME", "WHO TAUGHT THIS SYLLABUS?"],
      ["I KNOW EVERYTHING", "UNTIL THE EXAM STARTS"]
    ];
  }

  const selected = choices[
    Math.floor(Math.random() * choices.length)
  ];

  $("topText").value = selected[0];
  $("bottomText").value = selected[1];

  drawMeme();
  $("status").textContent =
    "Meme created! Choose Update preview or Download PNG.";
});

$("redrawButton").addEventListener("click", drawMeme);

["topText", "bottomText", "textColor", "fontSize"].forEach(id => {
  $(id).addEventListener("input", () => {
    if (photo) drawMeme();
  });
});

$("downloadButton").addEventListener("click", () => {
  if (!photo) {
    $("status").textContent = "Upload a photo first!";
    return;
  }

  drawMeme();

  const link = document.createElement("a");
  link.download = "my-meme.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
