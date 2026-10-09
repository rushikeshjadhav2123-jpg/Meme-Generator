
/* =========================================
   FUNNY MEME STUDIO
   Marathi + Hinglish | Comedy + Savage Roast
   No API key required
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const topInput = document.getElementById("topText");
  const bottomInput = document.getElementById("bottomText");
  const categorySelect = document.getElementById("funnyCategory");
  const generateBtn = document.getElementById("funnyGenerate");
  const status = document.getElementById("funnyStatus");

  if (!topInput || !bottomInput || !categorySelect ||
      !generateBtn || !status) {
    console.error("Funny Meme Studio: Required HTML elements missing.");
    return;
  }

  const captions = {
    college: [
      ["COLLEGE LA LATE AALO", "PAN ATTENDANCE LAVKAR GAYAB 😂"],
      ["GROUP STUDY SURU KELI", "2 TAAS FAKTA GOSSIP 🤣"],
      ["ASSIGNMENT UDYAA AAHE", "MI AJUN TITLE LIHITOY 💀"],
      ["COLLEGE CHA FULL CONFIDENCE", "SYLLABUS CHA ZERO KNOWLEDGE 🤡"],
      ["FRIENDS SOBAT COLLEGE", "LECTURE PEKSHA CANTEEN IMPORTANT 😂"],
      ["SIR: KUTHE HOTAS?", "ME: SIR, MENTALLY PRESENT HOTO 😭"]
    ],

    exam: [
      ["SYLLABUS 100% BAKI", "CONFIDENCE 200% 😂"],
      ["EXAM UDYAA AAHE", "ABHYAS UDYAPASUN 🤡"],
      ["QUESTION PAPER BAGHITLA", "DEVACH VACHAVNAR 🙏"],
      ["FRIEND: KITI ABHYAS ZALA?", "ME: PEN CHALAVLA BHAU 😂"],
      ["EASY PAPER MHANAT HOTE", "MAG MAJHA PAPER VEGALA HOTA KA? 💀"],
      ["ONE NIGHT BEFORE EXAM", "YOUTUBE VAR 10 HOUR REVISION 😭"]
    ],

    roast: [
      ["TU KHUP SPECIAL AHES", "ASA ERROR ROJ YET NAHI 😂"],
      ["ATTITUDE TAR BAGH", "TALENT AJUN LOADING... 💀"],
      ["TUJHA PLAN EK NUMBER", "EXECUTION AIRPLANE MODE 🤡"],
      ["TUJHI LOGIC AIKUN", "CALCULATOR NE RESIGN DILA 🤣"],
      ["TU GENIUS AHES BHAU", "PAN RESULT HIDDEN AAHE 😂"],
      ["TUJHA CONFIDENCE HEAVY", "FACTS MATRA ON LEAVE 💀"]
    ],

    marathi: [
      ["AAI: ABHYAS ZALA KA?", "MI: HO... MANAT 😂"],
      ["AAJ PASUN DIET SURU", "PAN VADAPAV DISLA 😭"],
      ["UDYA LAVKAR UTHNAR", "ALARM LA PAN MAHIT AAHE 🤡"],
      ["PAISE SAVE KARAYCHE HOTE", "PAN CHAI ANI VADAPAV 😂"],
      ["AATA PHONE THEVTO", "EK LAST REEL MAG PAKKA 💀"],
      ["AAI MHANTE KAM KAR", "MI MHANTO LOADING AAHE 😭"]
    ],

    friends: [
      ["BHAU 5 MINITAT YETO", "2 TAAS NANTAR: NIGHALO 😂"],
      ["FRIEND LA SECRET SANGITLA", "AATA PURNA GROUP LA MAHIT 💀"],
      ["BILL AALA KI BEST FRIEND", "NETWORK PROBLEM 🤡"],
      ["FRIEND: SERIOUS BOLAYCHAY", "MAG 2 TAAS BAKCHODI 🤣"],
      ["PHOTO KADH BHAU", "100 PHOTOS, EK PAN PERFECT NAHI 😂"],
      ["ONLINE DISATOS", "REPLY MATRA NEXT WEEK 😭"]
    ],

    random: [
      ["ME: AATA ZOPTO", "3 AM: ONE LAST REEL 😂"],
      ["MONDAY LA MOTIVATION", "TUESDAY LA DISAPPEAR 💀"],
      ["PHONE BATTERY 1%", "AJUN EK REEL BHAU 🤡"],
      ["PLAN: PRODUCTIVE DAY", "REALITY: BED ANI PHONE 😭"],
      ["EXPECTATION: BILLIONAIRE", "REALITY: BALANCE CHECK 😂"],
      ["LIFE SET KARAYCHI AAHE", "PAN FIRST CHAI PAHIJE ☕"],
      ["ME: NO MORE ONLINE SHOPPING", "ALSO ME: ORDER PLACED 💸"]
    ]
  };

  let previousIndex = -1;

  function generateCaption() {
    const selectedCategory = categorySelect.value;
    const list = captions[selectedCategory] || captions.random;

    let index = Math.floor(Math.random() * list.length);

    // Try not to repeat the last caption.
    if (list.length > 1) {
      while (index === previousIndex) {
        index = Math.floor(Math.random() * list.length);
      }
    }

    previousIndex = index;

    const joke = list[index];

    topInput.value = joke[0];
    bottomInput.value = joke[1];

    // Notify the existing meme editor to redraw the canvas.
    topInput.dispatchEvent(new Event("input", { bubbles: true }));
    bottomInput.dispatchEvent(new Event("input", { bubbles: true }));

    status.textContent = "🤣 Funny caption ready! Check your meme preview.";
  }

  generateBtn.addEventListener("click", generateCaption);

  // Show a random meme when the user chooses Random Funny.
  categorySelect.addEventListener("change", function () {
    if (categorySelect.value === "random") {
      generateCaption();
    }
  });

  console.log("😂 Funny Meme Studio loaded successfully!");
});
