(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const canvas = $("memeCanvas");
  const ctx = canvas.getContext("2d");
  const templates = [
    {
      name: "Surprise Test",
      emoji: "😱",
      bg: "#384b73",
      top: "TEACHER: SURPRISE TEST",
      bottom: "MY SOUL LEFT THE BODY 💀"
    },
    {
      name: "Monday Mood",
      emoji: "😩",
      bg: "#5b426b",
      top: "ME ON SUNDAY NIGHT",
      bottom: "MONDAY IS COMING AGAIN"
    },
    {
      name: "Big Brain",
      emoji: "🧠",
      bg: "#315b61",
      top: "I STUDIED FOR 5 MINUTES",
      bottom: "READY TO TEACH THE CLASS"
    },
    {
      name: "Distracted",
      emoji: "👀",
      bg: "#6b4a37",
      top: "ME TRYING TO FOCUS",
      bottom: "ONE NOTIFICATION LATER"
    },
    {
      name: "No Money",
      emoji: "💸",
      bg: "#4b527e",
      top: "SALARY JUST ARRIVED",
      bottom: "BILLS: HELLO THERE"
    },
    {
      name: "Sleepy",
      emoji: "🥱",
      bg: "#4e426c",
      top: "ONE MORE VIDEO",
      bottom: "SUNRISE: GOOD MORNING"
    },
    {
      name: "Exam Panic",
      emoji: "🤯",
      bg: "#7b454e",
      top: "I OPENED THE QUESTION PAPER",
      bottom: "I HAVE NEVER SEEN THESE WORDS"
    },
    {
      name: "Success",
      emoji: "😎",
      bg: "#386052",
      top: "ANSWERED ONE QUESTION",
      bottom: "TOPPER ENERGY ACTIVATED"
    }
  ];
  let selectedTemplate = 0;
  let selectedMood = "funny";
  let selectedImage = null;
  let selectedSource = "";
  let selectedSourceName = "Built-in template — no external image needed.";
  const moodCaptions = {
    funny: [
      "TEACHER: SURPRISE TEST TODAY",
      "MY SOUL LEFT THE BODY 💀"
    ],
    sarcastic: [
      "OH GREAT, ANOTHER TEST",
      "EXACTLY WHAT I WANTED 🙃"
    ],
    relatable: [
      "ME OPENING THE QUESTION PAPER",
      "I HAVE NEVER SEEN THESE WORDS 🥲"
    ],
    savage: [
      "I DIDN'T STUDY",
      "BUT I'M ABOUT TO IMPROVISE 🔥"
    ]
  };
  function drawBackground(template) {
    const gradient = ctx.createLinearGradient(
      0, 0, canvas.width, canvas.height
    );
    gradient.addColorStop(0, template.bg);
    gradient.addColorStop(1, "#10172d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "220px sans-serif";
    ctx.fillText(
      template.emoji,
      canvas.width / 2,
      canvas.height / 2
    );
    ctx.restore();
  }
  function drawImageCover(image) {
    const scale = Math.max(
      canvas.width / image.width,
      canvas.height / image.height
    );
    const width = image.width * scale;
    const height = image.height * scale;
    ctx.drawImage(
      image,
      (canvas.width - width) / 2,
      (canvas.height - height) / 2,
      width,
      height
    );
    ctx.fillStyle = "#00000035";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function wrapText(text, maxWidth, initialSize) {
    let fontSize = initialSize;
    let lines = [];
    while (fontSize >= 14) {
      ctx.font =
        `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
      lines = [];
      let currentLine = "";
      const words = text.split(/\s+/).filter(Boolean);
      for (const word of words) {
        const testLine = currentLine
          ? `${currentLine} ${word}`
          : word;
        if (
          ctx.measureText(testLine).width > maxWidth &&
          currentLine
        ) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      if (lines.length <= 2) break;
      fontSize -= 2;
    }
    return { lines, fontSize };
  }
  function drawCaption(text, position) {
    if (!text.trim()) return;
    const displayText = $("uppercase").checked
      ? text.toUpperCase()
      : text;
    const desiredSize = Number($("fontSize").value);
    const maxWidth = canvas.width - 55;
    const result = wrapText(
      displayText,
      maxWidth,
      desiredSize
    );
    const fontSize = result.fontSize;
    const lineHeight = fontSize * 1.12;
    ctx.save();
    ctx.font =
      `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = $("textColor").value;
    ctx.lineJoin = "round";
    ctx.lineWidth = $("outline").checked
      ? Math.max(3, fontSize * 0.12)
      : 0;
    ctx.strokeStyle = "#000000";
    const totalHeight = result.lines.length * lineHeight;
    const startY = position === "top"
      ? 45 + lineHeight / 2
      : canvas.height - 25 - totalHeight + lineHeight / 2;
    result.lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      if ($("outline").checked) {
        ctx.strokeText(
          line,
          canvas.width / 2,
          y,
          maxWidth
        );
      }
      ctx.fillText(
        line,
        canvas.width / 2,
        y,
        maxWidth
      );
    });
    ctx.restore();
  }
  function renderMeme() {
    canvas.width = 900;
    canvas.height = 650;
    if (selectedImage) {
      drawImageCover(selectedImage);
    } else {
      drawBackground(templates[selectedTemplate]);
    }
    drawCaption($("topText").value, "top");
    drawCaption($("bottomText").value, "bottom");
    $("fontSizeValue").textContent =
      `${$("fontSize").value} px`;
    $("photoCredit").textContent = selectedSourceName;
    const sourceLink = $("sourceLink");
    if (selectedSource) {
      sourceLink.href = selectedSource;
      sourceLink.classList.remove("hidden");
    } else {
      sourceLink.classList.add("hidden");
      sourceLink.removeAttribute("href");
    }
  }
  function buildTemplates() {
    const grid = $("templateGrid");
    grid.innerHTML = "";
    templates.forEach((template, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "template-card" +
        (index === selectedTemplate ? " active" : "");
      const thumbnail = document.createElement("div");
      thumbnail.className = "template-thumb";
      thumbnail.style.background = template.bg;
      thumbnail.textContent = template.emoji;
      const title = document.createElement("span");
      title.textContent = template.name;
      button.append(thumbnail, title);
      button.addEventListener("click", () => {
        selectedTemplate = index;
        selectedImage = null;
        selectedSource = "";
        selectedSourceName =
          "Built-in template — no external image needed.";
        $("topText").value = template.top;
        $("bottomText").value = template.bottom;
        document
          .querySelectorAll(".template-card")
          .forEach((card, i) => {
            card.classList.toggle("active", i === index);
          });
        renderMeme();
        $("status").textContent =
          `${template.name} template selected.`;
      });
      grid.appendChild(button);
    });
  }
  function makeCaptions() {
    const prompt = $("prompt").value.trim().toLowerCase();
    if (!prompt) {
      $("status").textContent =
        "Please describe your meme first.";
      return;
    }
    let captions;
    if (/exam|test|teacher|college|school|study|class|homework/.test(prompt)) {
      captions = moodCaptions[selectedMood];
    } else if (/money|salary|broke|shopping|bill/.test(prompt)) {
      captions = [
        "ME CHECKING MY BANK BALANCE",
        "WE DON'T TALK ABOUT THAT 💸"
      ];
    } else if (/sleep|tired|monday|morning/.test(prompt)) {
      captions = [
        "ME SAYING I'LL SLEEP EARLY",
        "3 AM: ONE LAST VIDEO 🥱"
      ];
    } else if (/friend|crush|relationship|bestie/.test(prompt)) {
      captions = [
        "ME: I'M NOT OVERTHINKING",
        "MY BRAIN AT 2 AM 👀"
      ];
    } else {
      captions = moodCaptions[selectedMood];
    }
    $("topText").value = captions[0];
    $("bottomText").value = captions[1];
    renderMeme();
    $("status").textContent =
      "Captions generated! You can edit both lines.";
  }
  async function searchFreePhotos() {
    const button = $("searchPhotos");
    const results = $("photoResults");
    button.disabled = true;
    button.textContent = "Searching...";
    results.innerHTML = "";
    $("status").textContent =
      "Searching Wikimedia Commons...";
    try {
      const prompt = $("prompt").value.toLowerCase();
      let searchTerm = "funny reaction face portrait";
      if (/cat|pet|animal/.test(prompt)) {
        searchTerm = "funny cat reaction";
      } else if (/exam|test|teacher|school|college|study/.test(prompt)) {
        searchTerm = "surprised student face";
      } else if (/sleep|tired|monday/.test(prompt)) {
        searchTerm = "tired person face";
      } else if (/money|salary|broke/.test(prompt)) {
        searchTerm = "surprised person face";
      }
      const apiURL = new URL(
        "https://commons.wikimedia.org/w/api.php"
      );
      apiURL.search = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        generator: "search",
        gsrsearch: `${searchTerm} filetype:bitmap`,
        gsrnamespace: "6",
        gsrlimit: "12",
        prop: "imageinfo",
        iiprop: "url|extmetadata",
        iiurlwidth: "420"
      });
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error("Photo search failed.");
      }
      const data = await response.json();
      const pages = Object.values(
        data.query?.pages || {}
      );
      if (!pages.length) {
        $("status").textContent =
          "No photos found. Try a different prompt or use a template.";
        return;
      }
      let count = 0;
      pages.forEach((page) => {
        const info = page.imageinfo?.[0];
        if (!info) return;
        const imageURL = info.thumburl || info.url;
        if (!imageURL) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "photo-result";
        const img = document.createElement("img");
        img.src = imageURL;
        img.alt = page.title || "Reaction photo";
        img.loading = "lazy";
        const label = document.createElement("span");
        label.textContent = (page.title || "Photo")
          .replace(/^File:/, "")
          .slice(0, 45);
        button.append(img, label);
        button.addEventListener("click", () => {
          loadPhoto(info, page, button);
        });
        results.appendChild(button);
        count++;
      });
      $("status").textContent = count
        ? "Select a photo. Check its licence before reuse."
        : "No usable photos found. Try again later.";
    } catch (error) {
      $("status").textContent =
        "Photo search unavailable. Check your internet or choose a template.";
    } finally {
      button.disabled = false;
      button.textContent = "🔎 Search Free Photos";
    }
  }
  function loadPhoto(info, page, button) {
    const url = info.thumburl || info.url;
    if (!url) return;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      selectedImage = image;
      selectedSource =
        info.descriptionurl ||
        "https://commons.wikimedia.org/";
      const metadata = info.extmetadata || {};
      const artist = (
        metadata.Artist?.value || "Author not listed"
      ).replace(/<[^>]*>/g, "").slice(0, 70);
      const license = (
        metadata.LicenseShortName?.value || "Check source licence"
      ).replace(/<[^>]*>/g, "");
      selectedSourceName =
        `Photo: ${artist} · Licence: ${license}`;
      document
        .querySelectorAll(".photo-result")
        .forEach((item) => {
          item.classList.toggle("active", item === button);
        });
      renderMeme();
      $("status").textContent =
        "Photo loaded! Edit captions and download.";
    };
    image.onerror = () => {
      $("status").textContent =
        "Could not load this image for export. Try another photo.";
    };
    image.src = url;
  }
  function downloadMeme() {
    try {
      const link = document.createElement("a");
      link.download = "my-meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      $("status").textContent =
        "Your meme has been downloaded!";
    } catch (error) {
      $("status").textContent =
        "This photo blocks export. Select a built-in template or another photo.";
    }
  }
  document.querySelectorAll(".mood").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      document.querySelectorAll(".mood").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      makeCaptions();
    });
  });
  [
    "topText",
    "bottomText",
    "textColor",
    "fontSize",
    "uppercase",
    "outline"
  ].forEach((id) => {
    $(id).addEventListener("input", renderMeme);
  });
  $("generateBtn").addEventListener("click", makeCaptions);
  $("searchPhotos").addEventListener("click", searchFreePhotos);
  $("downloadBtn").addEventListener("click", downloadMeme);
  $("copyBtn").addEventListener("click", async () => {
    const text =
      `${$("topText").value}\n${$("bottomText").value}`;
    try {
      await navigator.clipboard.writeText(text);
      $("status").textContent = "Captions copied!";
    } catch {
      $("status").textContent = text;
    }
  });
  $("resetBtn").addEventListener("click", () => {
    selectedTemplate = 0;
    selectedMood = "funny";
    selectedImage = null;
    selectedSource = "";
    selectedSourceName =
      "Built-in template — no external image needed.";
    $("prompt").value =
      "When the teacher announces a surprise test";
    $("textColor").value = "#ffffff";
    $("fontSize").value = "34";
    $("uppercase").checked = true;
    $("outline").checked = true;
    $("topText").value = templates[0].top;
    $("bottomText").value = templates[0].bottom;
    document.querySelectorAll(".mood").forEach((item) => {
      item.classList.toggle(
        "active",
        item.dataset.mood === "funny"
      );
    });
    document.querySelectorAll(".template-card").forEach((item, i) => {
      item.classList.toggle("active", i === 0);
    });
    $("photoResults").innerHTML = "";
    renderMeme();
    $("status").textContent = "Reset complete!";
  });
  buildTemplates();
  renderMeme();
})();
