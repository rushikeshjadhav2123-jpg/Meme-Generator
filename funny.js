
document.addEventListener("DOMContentLoaded", function () {
  const topInput = document.getElementById("topText");
  const bottomInput = document.getElementById("bottomText");
  const categorySelect = document.getElementById("funnyCategory");
  const generateBtn = document.getElementById("funnyGenerate");
  const status = document.getElementById("funnyStatus");

  if (!topInput || !bottomInput || !categorySelect ||
      !generateBtn || !status) {
    console.error("Funny Meme Studio: HTML elements missing.");
    return;
  }

  const captions = {
    college: [
      ["COLLEGE LA LATE AALO", "PAN ATTENDANCE LAVKAR GAYAB 😂"],
      ["GROUP STUDY SURU KELI", "2 TAAS FAKTA GOSSIP 🤣"],
      ["ASSIGNMENT UDYAA AAHE", "MI AJUN TITLE LIHITOY 💀"],
      ["COLLEGE CHA FULL CONFIDENCE", "SYLLABUS CHA ZERO KNOWLEDGE 🤡"],
      ["LECTURE PEKSHA", "CANTEEN JAST IMPORTANT 😂"],
      ["SIR: KUTHE HOTAS?", "MENTALLY PRESENT HOTO 😭"]
    ],

    exam: [
      ["SYLLABUS 100% BAKI", "CONFIDENCE 200% 😂"],
      ["EXAM UDYAA AAHE", "ABHYAS UDYAPASUN 🤡"],
      ["QUESTION PAPER BAGHITLA", "DEVACH VACHAVNAR 🙏"],
      ["FRIEND: KITI ABHYAS ZALA?", "PEN CHALAVLA BHAU 😂"],
      ["EASY PAPER MHANAT HOTE", "MAG MAJHA PAPER VEGALA HOTA KA? 💀"],
      ["ONE NIGHT BEFORE EXAM", "10 HOUR REVISION VIDEO 😭"]
    ],

    roast: [
      ["TU KHUP SPECIAL AHES", "ASA ERROR ROJ YET NAHI 😂"],
      ["ATTITUDE TAR BAGH", "TALENT AJUN LOADING... 💀"],
      ["TUJHA PLAN EK NUMBER", "EXECUTION AIRPLANE MODE 🤡"],
      ["TUJHI LOGIC AIKUN", "CALCULATOR NE RESIGN DILA 🤣"],
      ["TU GENIUS AHES BHAU", "PAN RESULT HIDDEN AAHE 😂"],
      ["CONFIDENCE HEAVY", "FACTS MATRA ON LEAVE 💀"]
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
      ["100 PHOTOS KADHLE", "EK PAN PERFECT NAHI 😂"],
      ["ONLINE DISATOS", "REPLY MATRA NEXT WEEK 😭"]
    ],

    relationship: [
      ["SHE SAID WE NEED TO TALK", "MY SOUL LEFT THE BODY 💀"],
      ["ONLINE 24/7", "REPLY AFTER 3 BUSINESS DAYS 😂"],
      ["CRUSH NE HI BOLA", "MI LAGNACHE SWAPNA BAGHITLE 🤡"],
      ["LOVE AT FIRST SIGHT", "BLOCK AT SECOND SIGHT 😭"],
      ["STATUS TAKLA CRUSH SATHI", "CRUSH LA KAHICH FARAK NAHI 😂"]
    ],

    family: [
      ["AAI: PHONE THEV KHALLI YE", "MI: LAST REEL AAI 😭"],
      ["RELATIVES: RESULT KAY LAGLA?", "WIFI PAN BAND ZALA 💀"],
      ["GHARI GUEST AALYAT", "ROOM MADHE INVISIBLE MODE 🤣"],
      ["AAI: MARKET MADHUN YE", "MI: GOOGLE MAPS PAN CONFUSED 😂"],
      ["BABANCHA EK LOOK", "FULL SYSTEM SHUTDOWN 🤐"]
    ],

    money: [
      ["SALARY CREDIT ZALI", "EMI NE HI BOLUN GHEUN GELI 💸"],
      ["BANK BALANCE CHECK KELA", "AATA FAKTA PRARTHANA 🙏"],
      ["ME: THIS MONTH SAVING", "SALE: HELLO BRO 😂"],
      ["FRIEND: PARTY DE", "ME: UPI SERVER DOWN 💀"],
      ["RICH MINDSET", "POCKET MADHE 12 RUPEES 🤡"]
    ],

    gaming: [
      ["PRO PLAYER IN MY DREAMS", "NOOB IN REALITY 🎮"],
      ["ONE LAST MATCH", "SUNRISE ZALA BHAU 🌅"],
      ["TEAM: COVER ME", "MI FIRST OUT 😂"],
      ["PING 999 MS", "BLAME THE TEAM 💀"],
      ["CHICKEN DINNER PAHIJE", "AADHI MAGGI TAR BANAV 🍜"]
    ],

    office: [
      ["BOSS: QUICK MEETING", "MY LUNCH BREAK RIP 💀"],
      ["WORK FROM HOME", "BED FROM WORK 😂"],
      ["MONDAY MOTIVATION", "5 MINUTES LATE AGAIN 🤡"],
      ["EXCEL OPEN KELA", "LIFE CHI VALUE KALALI 😭"],
      ["BOSS: ANY UPDATES?", "ME: YES, I AM STRESSED 💻"]
    ],

    savage: [
      ["TUJHA ATTITUDE SKY HIGH", "ACHIEVEMENTS AIRPLANE MODE 💀"],
      ["TUJHI ENTRY HERO SARAKHI", "EXIT MATRA EXTRA SARAKHA 😂"],
      ["TUJHA BRAIN FAST AAHE", "PAN NETWORK CONNECT HOT NAHI 🤡"],
      ["TUJHA SWAG HEAVY", "PAN LOGIC MISSING 😭"],
      ["ROAST KARAYLA GELO", "TU AADHICH SELF-ROAST KELAS 🤣"]
    ],

    random: [
      ["ME: AATA ZOPTO", "3 AM: ONE LAST REEL 😂"],
      ["MONDAY LA MOTIVATION", "TUESDAY LA DISAPPEAR 💀"],
      ["PHONE BATTERY 1%", "AJUN EK REEL BHAU 🤡"],
      ["PLAN: PRODUCTIVE DAY", "REALITY: BED ANI PHONE 😭"],
      ["EXPECTATION: BILLIONAIRE", "REALITY: BALANCE CHECK 😂"],
      ["LIFE SET KARAYCHI AAHE", "PAN FIRST CHAI PAHIJE ☕"],
      ["ME: NO MORE SHOPPING", "ALSO ME: ORDER PLACED 💸"]
    ]
  };

  let lastIndex = {};

  function generateCaption() {
    const category = categorySelect.value;
    const list = captions[category] || captions.random;

    let index;
    do {
      index = Math.floor(Math.random() * list.length);
    } while (list.length > 1 && index === lastIndex[category]);

    lastIndex[category] = index;

    topInput.value = list[index][0];
    bottomInput.value = list[index][1];

    topInput.dispatchEvent(new Event("input", { bubbles: true }));
    bottomInput.dispatchEvent(new Event("input", { bubbles: true }));

    status.textContent =
      "😂 Funny caption ready! Check your meme preview.";
  }

  generateBtn.addEventListener("click", generateCaption);

  categorySelect.addEventListener("change", function () {
    if (categorySelect.value === "random") {
      generateCaption();
    }
  });

  console.log("Funny Meme Studio loaded successfully!");
});
