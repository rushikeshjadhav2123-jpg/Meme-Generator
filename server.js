
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON requests
app.use(express.json({ limit: "10mb" }));

// AI Meme Generator API
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, mood, image } = req.body;

    // Check API key
    if (!process.env.AI_API_KEY) {
      return res.status(500).json({
        error: "API key missing. Please configure your .env file."
      });
    }

    // Validate input
    if (
      typeof prompt !== "string" ||
      !prompt.trim() ||
      typeof image !== "string" ||
      !/^data:image\/(png|jpe?g|webp);base64,/i.test(image)
    ) {
      return res.status(400).json({
        error: "Please provide a prompt and a valid image."
      });
    }

    if (image.length > 8 * 1024 * 1024) {
      return res.status(413).json({
        error: "Image too large. Please upload a smaller image."
      });
    }

    const baseURL = (
      process.env.AI_BASE_URL ||
      "https://openrouter.ai/api/v1"
    ).replace(/\/+$/, "");

    const model =
      process.env.AI_MODEL ||
      "google/gemini-2.5-flash";

    // Send image and prompt to AI
    const aiResponse = await fetch(
      `${baseURL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "AI Meme Generator"
        },
        body: JSON.stringify({
          model,
          temperature: 0.9,
          max_tokens: 250,
          messages: [
            {
              role: "system",
              content:
                'Create funny meme captions. Return only JSON: ' +
                '{"topText":"setup","bottomText":"punchline"}. ' +
                "Keep captions short and relevant to the image. " +
                "Do not include markdown or explanations."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    `Idea: ${prompt.slice(0, 1000)}\n` +
                    `Mood: ${String(mood || "Funny").slice(0, 50)}\n` +
                    "Analyze the uploaded image and create captions."
                },
                {
                  type: "image_url",
                  image_url: { url: image }
                }
              ]
            }
          ]
        })
      }
    );

    const result = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("AI provider error:", result);

      return res.status(502).json({
        error:
          result.error?.message ||
          "AI service failed. Check your API key and model."
      });
    }

    const content = result.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      return res.status(502).json({
        error: "AI did not return captions."
      });
    }

    // Parse the AI response
    const cleaned = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace < firstBrace) {
      throw new Error("Invalid AI response format.");
    }

    const captions = JSON.parse(
      cleaned.slice(firstBrace, lastBrace + 1)
    );

    if (
      typeof captions.topText !== "string" ||
      typeof captions.bottomText !== "string"
    ) {
      throw new Error("Invalid caption fields.");
    }

    // Send captions to frontend
    return res.json({
      topText: captions.topText.slice(0, 180),
      bottomText: captions.bottomText.slice(0, 180)
    });

  } catch (error) {
    console.error("Backend error:", error.message);

    return res.status(500).json({
      error: "Unable to generate meme. Please try again."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MemeAI running at http://localhost:${PORT}`);
});
